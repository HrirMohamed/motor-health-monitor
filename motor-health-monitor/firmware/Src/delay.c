/*
 * delay.c
 *
 *  Created on: Jul 27, 2026
 *      Author: mohamed
 */


#include "delay.h"

extern TIM_HandleTypeDef htim2;

/*---------------------------------------------------------
    Initialize Delay Timer
---------------------------------------------------------*/

void Delay_Init(void)
{
    HAL_TIM_Base_Start(&htim2);
}

/*---------------------------------------------------------
    Microsecond Delay
---------------------------------------------------------*/

void delay_us(uint16_t us)
{
    __HAL_TIM_SET_COUNTER(&htim2, 0);

    while (__HAL_TIM_GET_COUNTER(&htim2) < us)
    {
    }
}
