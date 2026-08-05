
#include "protocol.h"
#include "uart.h"
#include <stdio.h>
#include <string.h>
#include "ds18b20.h"
#include "adxl345.h"
#include "vibration.h"
#include "rpm.h"
#include "oled.h"

#define BUZZER_PORT GPIOC
#define BUZZER_PIN  GPIO_PIN_13    // Change to your buzzer pin

/*=========================================================
    Private Variables
=========================================================*/

static uint8_t acquisitionRunning = 0;

static uint32_t startTime = 0;
static uint32_t lastSample = 0;
static float ax = 0.0f;
static float ay = 0.0f;
static float az = 0.0f;

static float temperature;
static float vib;
static float RPM;

/* Throttle OLED refresh so it doesn't block every single loop iteration */
static int oledCounter = 0;
#define OLED_REFRESH_EVERY_N_LOOPS 3

/* Non-blocking buzzer state */
typedef struct {
    uint8_t  active;      // beep currently ON
    uint32_t offTime;     // tick at which to turn OFF

    uint8_t  pending;     // remaining beeps in a "BeepTimes" sequence
    uint16_t onDuration;  // ON time for each beep in the sequence
    uint16_t gapDuration; // OFF time between beeps in the sequence
    uint8_t  inGap;       // currently in the OFF gap between beeps
    uint32_t gapEndTime;  // tick at which the gap ends
} BuzzerState;

static BuzzerState buzzer = {0};

/* Non-blocking "show logo after handshake" state (replaces HAL_Delay(1000)) */
static uint8_t  showLogoPending = 0;
static uint32_t showLogoTime    = 0;

/*=========================================================
    Private Function Prototypes
=========================================================*/

static void ReceiveCommand(void);
static void SendMeasurements(void);
static void BlinkLED(void);
static void Buzzer_Start(uint16_t time_ms);
static void Buzzer_StartTimes(uint8_t count, uint16_t time_ms);
static void Buzzer_Update(void);

/*=========================================================
    Public Functions
=========================================================*/

void Protocol_Init(void)
{
    acquisitionRunning = 0;
    startTime = 0;
    lastSample = 0;

    buzzer.active  = 0;
    buzzer.pending = 0;
    buzzer.inGap   = 0;

    showLogoPending = 0;
}

void Protocol_Task(void)
{
    ReceiveCommand();

    /* Must be called every loop, never blocks */
    Buzzer_Update();

    /* Non-blocking replacement for the old HAL_Delay(1000) + OLED_ShowLogo() */
    if (showLogoPending && (HAL_GetTick() - showLogoTime >= 1000))
    {
        showLogoPending = 0;
        OLED_ShowLogo();
    }

    if (acquisitionRunning)
    {
        SendMeasurements();
        OLED_ShowMeasurements(
                      temperature,
                      vib,
                      RPM
                  );


        /* Throttle OLED writes: they're blocking I2C, so don't do them
           every single loop iteration or they'll starve the 10ms
           vibration sampling in SendMeasurements(). */
        oledCounter++;
        if (oledCounter >= OLED_REFRESH_EVERY_N_LOOPS)
        {
            oledCounter = 0;

        }
    }
}

/*=========================================================
    Private Functions
=========================================================*/

static void ReceiveCommand(void)
{
    UART_Task();

    if (!UART_CommandAvailable())
        return;

    char *cmd = UART_GetCommand();

    /*-----------------------------
      Handshake
    ------------------------------*/
    if (strcmp(cmd, "X") == 0)
    {
    	OLED_ShowMessage("Appareil "," connecte ");
        Buzzer_Start(100);
        UART_SendLine("CONNECTED");

        /* Show the logo 1 second from now, without blocking */
        showLogoPending = 1;
        showLogoTime    = HAL_GetTick();

        return;
    }

    /*-----------------------------
      LED Test
    ------------------------------*/
    if (strcmp(cmd, "S") == 0)
    {
        Buzzer_StartTimes(2, 100);
        //BlinkLED();
        return;
    }

    /*-----------------------------
      Start Acquisition
    ------------------------------*/
    if (strcmp(cmd, "START") == 0)
    {
        if (acquisitionRunning)
            return;

        acquisitionRunning = 1;

        startTime  = HAL_GetTick();
        lastSample = 0;
        Buzzer_Start(300);

        UART_SendLine("STARTED");

        return;
    }

    /*-----------------------------
      Unknown Command
    ------------------------------*/
    UART_SendLine("UNKNOWN COMMAND");
}

static void SendMeasurements(void)
{
    static uint32_t lastSample    = 0;
    static uint32_t lastVibration = 0;

    char text[50];

    /*---------------------------------------
      Stop automatically after 60 seconds
    ---------------------------------------*/
    if ((HAL_GetTick() - startTime) >= 60000)
    {
        acquisitionRunning = 0;

        UART_SendLine("DONE");
        Buzzer_StartTimes(3, 200);
        return;
    }

    /*---------------------------------------
      Update vibration every 10 ms
    ---------------------------------------*/
    if (HAL_GetTick() - lastVibration >= 10)
    {
        lastVibration = HAL_GetTick();

        if (ADXL345_ReadAcceleration(&ax, &ay, &az) == HAL_OK)
        {
            Vibration_Update(ax, ay, az);
        }
    }

    /*---------------------------------------
      Send measurements every second
    ---------------------------------------*/
    if (HAL_GetTick() - lastSample >= 1000)
    {
        lastSample = HAL_GetTick();

        //sending temp//
        if (DS18B20_IsConversionDone())
        {
            if (DS18B20_ReadTemperature(&temperature) == HAL_OK)
            {
                sprintf(text, "TEMP:%.2f\r\n", temperature);
                UART_SendString(text);
            }

            DS18B20_StartConversion();
        }

        //sending vibration//
        if (Vibration_IsReady())
        {
            vib = Vibration_GetVelocity_mms();
            sprintf(text, "VIB:%.2f\r\n", vib);
        }
        else
        {
            sprintf(text, "VIB:NOT READY\r\n");
        }
        UART_SendString(text);

        //sending RPM//
        RPM = RPM_Get();
        sprintf(text, "RPM:%0.f\r\n", RPM);
        UART_SendString(text);

        /* Short beep every transmission (non-blocking) */
        Buzzer_Start(40);
    }
}


/*=========================================================
    Non-blocking Buzzer
=========================================================*/

/* Start (or restart) a single beep of time_ms, returns immediately */
static void Buzzer_Start(uint16_t time_ms)
{
    HAL_GPIO_WritePin(BUZZER_PORT, BUZZER_PIN, GPIO_PIN_SET);
    buzzer.active  = 1;
    buzzer.offTime = HAL_GetTick() + time_ms;

    /* A one-shot beep cancels any pending multi-beep sequence */
    buzzer.pending = 0;
    buzzer.inGap   = 0;
}

/* Start a sequence of `count` beeps of time_ms each, 100ms gap between them.
   Returns immediately; the sequence advances inside Buzzer_Update(). */
static void Buzzer_StartTimes(uint8_t count, uint16_t time_ms)
{
    if (count == 0)
        return;

    buzzer.onDuration  = time_ms;
    buzzer.gapDuration = 100;
    buzzer.pending     = count - 1; /* beeps remaining AFTER the current one */
    buzzer.inGap       = 0;

    HAL_GPIO_WritePin(BUZZER_PORT, BUZZER_PIN, GPIO_PIN_SET);
    buzzer.active  = 1;
    buzzer.offTime = HAL_GetTick() + time_ms;
}

/* Call this once per Protocol_Task() iteration. Never blocks. */
static void Buzzer_Update(void)
{
    uint32_t now = HAL_GetTick();

    if (buzzer.active)
    {
        if (now >= buzzer.offTime)
        {
            HAL_GPIO_WritePin(BUZZER_PORT, BUZZER_PIN, GPIO_PIN_RESET);
            buzzer.active = 0;

            if (buzzer.pending > 0)
            {
                /* Start the gap before the next beep in the sequence */
                buzzer.inGap      = 1;
                buzzer.gapEndTime = now + buzzer.gapDuration;
            }
        }
    }
    else if (buzzer.inGap)
    {
        if (now >= buzzer.gapEndTime)
        {
            buzzer.inGap = 0;
            buzzer.pending--;

            HAL_GPIO_WritePin(BUZZER_PORT, BUZZER_PIN, GPIO_PIN_SET);
            buzzer.active  = 1;
            buzzer.offTime = now + buzzer.onDuration;
        }
    }
}
