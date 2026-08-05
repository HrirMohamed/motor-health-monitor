#ifndef __VIBRATION_H__
#define __VIBRATION_H__

#include <stdint.h>

/*=========================================================
    Vibration Velocity Estimator (mm/s RMS)

    Converts acceleration samples (in g) into an estimated
    vibration velocity magnitude in mm/s, similar to what
    industrial vibration sensors report (ISO 10816 style).

    Method:
      1. High-pass filter acceleration to remove gravity/DC.
      2. Integrate acceleration -> velocity.
      3. High-pass filter velocity to remove integration drift.
      4. Accumulate RMS over a window of samples.

    NOTE: This is a lightweight embedded approximation, not a
    calibrated instrument. Good for relative/trend monitoring
    (e.g. "vibration went from 2 mm/s to 8 mm/s"), not for
    certified ISO 10816 compliance measurements.
=========================================================*/

/* Call once at startup.
 * sample_rate_hz : how often Vibration_Update() will be called (e.g. 100.0f)
 * hpf_cutoff_hz   : high-pass cutoff to remove gravity/drift (e.g. 1.0f)
 * window_samples  : samples per RMS window (e.g. 100 = 1s window at 100Hz)
 */
void Vibration_Init(float sample_rate_hz, float hpf_cutoff_hz, uint16_t window_samples);

/* Call once per acceleration sample, at a FIXED time interval
 * matching sample_rate_hz. Pass acceleration in g for each axis
 * (e.g. straight from ADXL345_ReadAcceleration). */
void Vibration_Update(float ax_g, float ay_g, float az_g);

/* Returns 1 once a full RMS window has been accumulated. */
uint8_t Vibration_IsReady(void);

/* Returns RMS vibration velocity magnitude in mm/s.
 * Only meaningful after Vibration_IsReady() returns 1.
 * Reading it also starts accumulating the next window. */
float Vibration_GetVelocity_mms(void);

#endif /* __VIBRATION_H__ */
