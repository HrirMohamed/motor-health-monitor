/*
 * uart.c
 *
 *  Created on: Jul 27, 2026
 *      Author: mohamed
 */


#include "uart.h"

#include <string.h>
#include <stdio.h>

/* UART Handle from main.c */
extern UART_HandleTypeDef huart1;

/* Private Variables */
static uint8_t uartRxByte;

static char uartCommandBuffer[30];
static char uartCurrentCommand[30];

static uint8_t uartIndex = 0;
static uint8_t uartCommandReady = 0;


/*----------------------------------------------------
    UART Initialization
----------------------------------------------------*/
void UART_Init(void)
{
    HAL_UART_Receive_IT(&huart1, &uartRxByte, 1);
}


/*----------------------------------------------------
    Send String
----------------------------------------------------*/
void UART_SendString(char *text)
{
    HAL_UART_Transmit(&huart1,
                      (uint8_t*)text,
                      strlen(text),
                      HAL_MAX_DELAY);
}


/*----------------------------------------------------
    Send Line
----------------------------------------------------*/
void UART_SendLine(char *text)
{
    UART_SendString(text);
    UART_SendString("\r\n");
}


/*----------------------------------------------------
    UART Task
----------------------------------------------------*/
void UART_Task(void)
{
    /* Nothing here for now */

    /* Later we can add
       timeouts,
       packet checking,
       etc.
    */
}


/*----------------------------------------------------
    Command Available
----------------------------------------------------*/
uint8_t UART_CommandAvailable(void)
{
    return uartCommandReady;
}


/*----------------------------------------------------
    Get Command
----------------------------------------------------*/
char* UART_GetCommand(void)
{
    uartCommandReady = 0;

    return uartCurrentCommand;
}


/*----------------------------------------------------
    UART Interrupt Callback
----------------------------------------------------*/
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if(huart->Instance == USART1)
    {
        if(uartRxByte == '\r')
        {
            /* Ignore */
        }

        else if(uartRxByte == '\n')
        {
            uartCommandBuffer[uartIndex] = '\0';

            strcpy(uartCurrentCommand,
                   uartCommandBuffer);

            uartIndex = 0;

            uartCommandReady = 1;
        }

        else
        {
            if(uartIndex < sizeof(uartCommandBuffer)-1)
            {
                uartCommandBuffer[uartIndex++] = uartRxByte;
            }
        }

        HAL_UART_Receive_IT(&huart1,
                            &uartRxByte,
                            1);
    }
}
