#ifndef __UART_H__
#define __UART_H__

#include "main.h"
#include <stdint.h>

/* Public Functions */
void UART_Init(void);
void UART_Task(void);

void UART_SendString(char *text);
void UART_SendLine(char *text);

uint8_t UART_CommandAvailable(void);
char* UART_GetCommand(void);

#endif
