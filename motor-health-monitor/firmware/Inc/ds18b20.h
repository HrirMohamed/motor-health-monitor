/*
 * ds18b20.h
 *
 *  Created on: Jul 27, 2026
 *      Author: mohamed
 */
#ifndef __DS18B20_H__
#define __DS18B20_H__

#include "main.h"

HAL_StatusTypeDef DS18B20_Init(void);

uint8_t DS18B20_IsConnected(void);

HAL_StatusTypeDef DS18B20_StartConversion(void);

uint8_t DS18B20_IsConversionDone(void);

HAL_StatusTypeDef DS18B20_ReadTemperature(float *temperature);

#endif
