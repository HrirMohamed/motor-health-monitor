#ifndef __ADXL345_H__
#define __ADXL345_H__

#include "main.h"
#include <stdint.h>

/*=========================================================
    ADXL345 I2C Address
=========================================================*/
#define ADXL345_ADDRESS      (0x53 << 1)

/*=========================================================
    Registers
=========================================================*/
#define ADXL345_DEVID        0x00
#define ADXL345_BW_RATE      0x2C
#define ADXL345_POWER_CTL    0x2D
#define ADXL345_DATA_FORMAT  0x31
#define ADXL345_DATAX0       0x32

/*=========================================================
    Public Functions
=========================================================*/

/* Initialize sensor */
HAL_StatusTypeDef ADXL345_Init(void);

/* Check sensor connection */
uint8_t ADXL345_IsConnected(void);

/* Read raw acceleration (LSB) */
HAL_StatusTypeDef ADXL345_ReadRaw(int16_t *x,
                                  int16_t *y,
                                  int16_t *z);

/* Read acceleration (g) */
HAL_StatusTypeDef ADXL345_ReadAcceleration(float *x,
                                           float *y,
                                           float *z);

/*=========================================================
    Debug Functions
=========================================================*/

/* Read any register (used for debugging) */
uint8_t ADXL345_ReadByte(uint8_t reg);

#endif /* __ADXL345_H__ */
