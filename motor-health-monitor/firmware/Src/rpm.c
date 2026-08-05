#include "rpm.h"

static volatile uint32_t pulseCount = 0;

static uint32_t lastUpdate = 0;
static uint32_t lastPulse  = 0;

static float rpm = 0.0f;

/* Number of pulses generated for one shaft revolution */
#define PULSES_PER_REVOLUTION   1

/* Minimum time (ms) between valid pulses, for debounce */
#define PULSE_DEBOUNCE_MS       5

void RPM_Init(void)
{
    pulseCount = 0;
    rpm = 0;
    lastUpdate = HAL_GetTick();
    lastPulse = 0;
}

void RPM_PulseDetected(void)
{
    uint32_t now = HAL_GetTick();

    if ((now - lastPulse) >= PULSE_DEBOUNCE_MS)
    {
        pulseCount++;
        lastPulse = now;
    }
}

void RPM_Task(void)
{
    uint32_t now = HAL_GetTick();
    uint32_t elapsed = now - lastUpdate;

    if (elapsed >= 1000)
    {
        __disable_irq();
        uint32_t count = pulseCount;
        pulseCount = 0;
        __enable_irq();

        rpm = ((float)count * 60000.0f) / ((float)elapsed * PULSES_PER_REVOLUTION);

        lastUpdate = now;
    }
}

float RPM_Get(void)
{
    return rpm;
}
