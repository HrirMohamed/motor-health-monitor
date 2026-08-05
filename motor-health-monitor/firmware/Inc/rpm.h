/*
 * rpm.h
 *
 *  Created on: Jul 27, 2026
 *      Author: mohamed
 */

#ifndef INC_RPM_H_
#define INC_RPM_H_





#include "stm32f1xx_hal.h"

void RPM_Init(void);
void RPM_PulseDetected(void);
void RPM_Task(void);

float RPM_Get(void);


#endif /* INC_RPM_H_ */
