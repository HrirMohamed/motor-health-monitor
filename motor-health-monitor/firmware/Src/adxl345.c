/*
 * adxl345.c
 *
 *  Created on: Jul 27, 2026
 *      Author: Mohamed
 */

#include "adxl345.h"

extern I2C_HandleTypeDef hi2c1;

/*=========================================================
    Private Functions
=========================================================*/

static HAL_StatusTypeDef ADXL345_WriteRegister(uint8_t reg, uint8_t value)
{
    return HAL_I2C_Mem_Write(&hi2c1,
                             ADXL345_ADDRESS,
                             reg,
                             I2C_MEMADD_SIZE_8BIT,
                             &value,
                             1,
                             HAL_MAX_DELAY);
}

static HAL_StatusTypeDef ADXL345_ReadRegister(uint8_t reg, uint8_t *value)
{
    return HAL_I2C_Mem_Read(&hi2c1,
                            ADXL345_ADDRESS,
                            reg,
                            I2C_MEMADD_SIZE_8BIT,
                            value,
                            1,
                            HAL_MAX_DELAY);
}

static HAL_StatusTypeDef ADXL345_ReadRegisters(uint8_t reg,
                                               uint8_t *buffer,
                                               uint8_t length)
{
    return HAL_I2C_Mem_Read(&hi2c1,
                            ADXL345_ADDRESS,
                            reg,
                            I2C_MEMADD_SIZE_8BIT,
                            buffer,
                            length,
                            HAL_MAX_DELAY);
}

/*=========================================================
    Public Functions
=========================================================*/

uint8_t ADXL345_IsConnected(void)
{
    uint8_t id;

    if (ADXL345_ReadRegister(ADXL345_DEVID, &id) != HAL_OK)
        return 0;

    return (id == 0xE5);
}

HAL_StatusTypeDef ADXL345_Init(void)
{
    if (!ADXL345_IsConnected())
        return HAL_ERROR;

    /* 100 Hz Output Data Rate */
    if (ADXL345_WriteRegister(ADXL345_BW_RATE, 0x0A) != HAL_OK)
        return HAL_ERROR;

    /* Full Resolution ±2g */
    if (ADXL345_WriteRegister(ADXL345_DATA_FORMAT, 0x08) != HAL_OK)
        return HAL_ERROR;

    /* Measurement Mode */
    if (ADXL345_WriteRegister(ADXL345_POWER_CTL, 0x08) != HAL_OK)
        return HAL_ERROR;

    return HAL_OK;
}

HAL_StatusTypeDef ADXL345_ReadRaw(int16_t *x,
                                  int16_t *y,
                                  int16_t *z)
{
    uint8_t dataX[2];
    uint8_t dataY[2];
    uint8_t dataZ[2];

    /* Read each axis as its own 2-byte transfer instead of one 6-byte
     * burst. On this board, the 6-byte HAL_I2C_Mem_Read burst was
     * corrupting the Z-axis high byte (confirmed by comparing against
     * two separate single-byte reads of DATAZ0/DATAZ1). */
    if (ADXL345_ReadRegisters(ADXL345_DATAX0, dataX, 2) != HAL_OK)
        return HAL_ERROR;

    if (ADXL345_ReadRegisters(ADXL345_DATAX0 + 2, dataY, 2) != HAL_OK)
        return HAL_ERROR;

    if (ADXL345_ReadRegisters(ADXL345_DATAX0 + 4, dataZ, 2) != HAL_OK)
        return HAL_ERROR;

    *x = (int16_t)((dataX[1] << 8) | dataX[0]);
    *y = (int16_t)((dataY[1] << 8) | dataY[0]);
    *z = (int16_t)((dataZ[1] << 8) | dataZ[0]);

    return HAL_OK;
}

HAL_StatusTypeDef ADXL345_ReadAcceleration(float *x,
                                           float *y,
                                           float *z)
{
    int16_t rawX, rawY, rawZ;

    if (ADXL345_ReadRaw(&rawX, &rawY, &rawZ) != HAL_OK)
        return HAL_ERROR;

    *x = rawX * 0.0039f;
    *y = rawY * 0.0039f;
    *z = rawZ * 0.0039f;

    return HAL_OK;
}

/*=========================================================
    Debug Functions
=========================================================*/

uint8_t ADXL345_ReadByte(uint8_t reg)
{
    uint8_t value = 0;

    ADXL345_ReadRegister(reg, &value);

    return value;
}
