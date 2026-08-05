/*
 * oled.h
 *
 *  Created on: Jul 30, 2026
 *      Author: mohamed
 */

#ifndef INC_OLED_H_
#define INC_OLED_H_



#include <stdint.h>

void OLED_Init(void);

/* Startup screen */
void OLED_ShowLogo(void);

/*co/disco*/

//void OLED_ShowNotConnected(void);
//void OLED_ShowConnected(void);

/* Live measurements */
void OLED_ShowMeasurements(float temperature,
                           float vibration,
                           uint16_t rpm);

/* Acquisition finished */
void OLED_ShowFinished(void);

/* Generic message */
void OLED_ShowMessage(char *line1,
                      char *line2);



#endif /* INC_OLED_H_ */
