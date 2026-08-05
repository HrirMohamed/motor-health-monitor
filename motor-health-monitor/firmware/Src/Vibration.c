/*
 * Vibration.c
 *
 *  Created on: Jul 27, 2026
 *      Author: mohamed
 */


/*
 * vibration.c
 *
 * Estimates vibration velocity (mm/s RMS) from ADXL345
 * acceleration samples (in g).
 */

#include "vibration.h"
#include <math.h>

#define GRAVITY_MS2   9.80665f
#define PI            3.14159265f

/*=========================================================
    Simple one-pole high-pass filter
=========================================================*/
typedef struct {
    float prev_in;
    float prev_out;
} HPF_t;

static float HPF_Apply(HPF_t *f, float alpha, float x)
{
    float y = alpha * (f->prev_out + x - f->prev_in);
    f->prev_in  = x;
    f->prev_out = y;
    return y;
}

/*=========================================================
    Module state
=========================================================*/
static HPF_t hpf_accel[3];
static HPF_t hpf_vel[3];

static float velocity[3] = {0.0f, 0.0f, 0.0f};

static float dt        = 0.01f;
static float hpf_alpha  = 0.0f;
static uint16_t window   = 100;

static float sum_sq        = 0.0f;
static uint16_t sample_cnt = 0;
static uint8_t  ready_flag = 0;
static float last_rms_mms  = 0.0f;

/*=========================================================
    Public Functions
=========================================================*/

void Vibration_Init(float sample_rate_hz, float hpf_cutoff_hz, uint16_t window_samples)
{
    dt = 1.0f / sample_rate_hz;

    /* alpha for a discrete one-pole HPF from the RC time constant */
    float rc = 1.0f / (2.0f * PI * hpf_cutoff_hz);
    hpf_alpha = rc / (rc + dt);

    window = window_samples;

    for (int i = 0; i < 3; i++)
    {
        hpf_accel[i].prev_in  = 0.0f;
        hpf_accel[i].prev_out = 0.0f;
        hpf_vel[i].prev_in    = 0.0f;
        hpf_vel[i].prev_out   = 0.0f;
        velocity[i] = 0.0f;
    }

    sum_sq      = 0.0f;
    sample_cnt  = 0;
    ready_flag  = 0;
    last_rms_mms = 0.0f;
}

void Vibration_Update(float ax_g, float ay_g, float az_g)
{
    float a[3];
    a[0] = ax_g * GRAVITY_MS2;
    a[1] = ay_g * GRAVITY_MS2;
    a[2] = az_g * GRAVITY_MS2;

    float v_mag_sq = 0.0f;

    for (int i = 0; i < 3; i++)
    {
        /* 1) remove gravity / slow drift from acceleration */
        float a_ac = HPF_Apply(&hpf_accel[i], hpf_alpha, a[i]);

        /* 2) integrate acceleration -> velocity (simple Euler) */
        velocity[i] += a_ac * dt;

        /* 3) remove integration drift from velocity */
        float v_ac = HPF_Apply(&hpf_vel[i], hpf_alpha, velocity[i]);

        v_mag_sq += v_ac * v_ac;
    }

    sum_sq += v_mag_sq;
    sample_cnt++;

    if (sample_cnt >= window)
    {
        float mean_sq = sum_sq / (float)sample_cnt;
        float rms_ms  = sqrtf(mean_sq);

        last_rms_mms = rms_ms * 1000.0f; /* m/s -> mm/s */

        sum_sq     = 0.0f;
        sample_cnt = 0;
        ready_flag = 1;
    }
}

uint8_t Vibration_IsReady(void)
{
    return ready_flag;
}

float Vibration_GetVelocity_mms(void)
{
    ready_flag = 0;
    return last_rms_mms;
}
