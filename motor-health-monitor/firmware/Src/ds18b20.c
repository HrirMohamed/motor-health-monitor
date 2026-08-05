/*
 * ds18b20.c
 *
 *  Created on: Jul 27, 2026
 *      Author: Mohamed
 */

#include "ds18b20.h"

/*=========================================================
    GPIO Configuration
=========================================================*/

#define DS18B20_PORT    GPIOA
#define DS18B20_PIN     GPIO_PIN_0

extern void delay_us(uint16_t us);

/*=========================================================
    Module State
=========================================================*/

static uint32_t conversionStart = 0;
static uint8_t conversionRunning = 0;

/*=========================================================
    Private Functions
=========================================================*/

static void DS18B20_PinOutput(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    GPIO_InitStruct.Pin   = DS18B20_PIN;
    GPIO_InitStruct.Mode  = GPIO_MODE_OUTPUT_OD;
    GPIO_InitStruct.Pull  = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;

    HAL_GPIO_Init(DS18B20_PORT, &GPIO_InitStruct);
}

static void DS18B20_PinInput(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    GPIO_InitStruct.Pin  = DS18B20_PIN;
    GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
    GPIO_InitStruct.Pull = GPIO_NOPULL;

    HAL_GPIO_Init(DS18B20_PORT, &GPIO_InitStruct);
}

/*=========================================================
    Reset Pulse
=========================================================*/

static uint8_t DS18B20_Reset(void)
{
    uint8_t presence;

    DS18B20_PinOutput();

    HAL_GPIO_WritePin(DS18B20_PORT,
                      DS18B20_PIN,
                      GPIO_PIN_RESET);

    delay_us(480);

    DS18B20_PinInput();

    delay_us(70);

    presence = !HAL_GPIO_ReadPin(DS18B20_PORT,
                                 DS18B20_PIN);

    delay_us(410);

    return presence;
}

/*=========================================================
    Write One Bit
=========================================================*/

static void DS18B20_WriteBit(uint8_t bit)
{
    DS18B20_PinOutput();

    HAL_GPIO_WritePin(DS18B20_PORT,
                      DS18B20_PIN,
                      GPIO_PIN_RESET);

    if(bit)
    {
        delay_us(5);

        DS18B20_PinInput();

        delay_us(55);
    }
    else
    {
        delay_us(60);

        DS18B20_PinInput();

        delay_us(5);
    }
}

/*=========================================================
    Read One Bit
=========================================================*/

static uint8_t DS18B20_ReadBit(void)
{
    uint8_t bit;

    DS18B20_PinOutput();

    HAL_GPIO_WritePin(DS18B20_PORT,
                      DS18B20_PIN,
                      GPIO_PIN_RESET);

    delay_us(3);

    DS18B20_PinInput();

    delay_us(10);

    bit = HAL_GPIO_ReadPin(DS18B20_PORT,
                           DS18B20_PIN);

    delay_us(53);

    return bit;
}

/*=========================================================
    Write Byte
=========================================================*/

static void DS18B20_WriteByte(uint8_t data)
{
    for(uint8_t i=0;i<8;i++)
    {
        DS18B20_WriteBit(data & 0x01);
        data >>= 1;
    }
}

/*=========================================================
    Read Byte
=========================================================*/

static uint8_t DS18B20_ReadByte(void)
{
    uint8_t value = 0;

    for(uint8_t i=0;i<8;i++)
    {
        if(DS18B20_ReadBit())
        {
            value |= (1<<i);
        }
    }

    return value;
}

/*=========================================================
    Set Resolution to 10-bit
=========================================================*/

static HAL_StatusTypeDef DS18B20_SetResolution10Bit(void)
{
    if(!DS18B20_Reset())
        return HAL_ERROR;

    DS18B20_WriteByte(0xCC);      // Skip ROM

    DS18B20_WriteByte(0x4E);      // Write Scratchpad

    DS18B20_WriteByte(75);        // TH

    DS18B20_WriteByte(70);        // TL

    DS18B20_WriteByte(0x3F);      // 10-bit resolution

    return HAL_OK;
}

/*=========================================================
    Public Functions
=========================================================*/

HAL_StatusTypeDef DS18B20_Init(void)
{
    if(!DS18B20_Reset())
        return HAL_ERROR;

    return DS18B20_SetResolution10Bit();
}

uint8_t DS18B20_IsConnected(void)
{
    return DS18B20_Reset();
}

/*---------------------------------------------------------
    Start Temperature Conversion
---------------------------------------------------------*/

HAL_StatusTypeDef DS18B20_StartConversion(void)
{
    if(!DS18B20_Reset())
        return HAL_ERROR;

    DS18B20_WriteByte(0xCC);      // Skip ROM

    DS18B20_WriteByte(0x44);      // Convert Temperature

    conversionStart = HAL_GetTick();

    conversionRunning = 1;

    return HAL_OK;
}

/*---------------------------------------------------------
    Check if Conversion Finished
---------------------------------------------------------*/

uint8_t DS18B20_IsConversionDone(void)
{
    if(!conversionRunning)
        return 0;

    /* 10-bit conversion = 188 ms */

    if((HAL_GetTick() - conversionStart) >= 188)
    {
        conversionRunning = 0;

        return 1;
    }

    return 0;
}

/*---------------------------------------------------------
    Read Temperature
---------------------------------------------------------*/

HAL_StatusTypeDef DS18B20_ReadTemperature(float *temperature)
{
    uint8_t temp_l;
    uint8_t temp_h;

    int16_t raw;

    if(!DS18B20_Reset())
        return HAL_ERROR;

    DS18B20_WriteByte(0xCC);      // Skip ROM

    DS18B20_WriteByte(0xBE);      // Read Scratchpad

    temp_l = DS18B20_ReadByte();

    temp_h = DS18B20_ReadByte();

    raw = (temp_h << 8) | temp_l;

    *temperature = (float)raw / 16.0f;

    return HAL_OK;
}
