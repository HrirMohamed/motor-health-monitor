/*
 * oled.c
 *
 * Created on: Jul 30, 2026
 * Author: Mohamed
 */

#include "oled.h"
#include "ssd1306.h"
#include "ssd1306_fonts.h"
#include "logo.h"

#include <stdio.h>

void OLED_Init(void)
{
    ssd1306_Init();
    ssd1306_Fill(Black);
    ssd1306_UpdateScreen();
}

void OLED_ShowLogo(void)
{
	ssd1306_Fill(Black);
	ssd1306_DrawBitmap(0, 0, ocp_logo, 128, 64, White);
	ssd1306_UpdateScreen();
}

void OLED_ShowMeasurements(float temperature,
                           float vibration,
                           uint16_t rpm)
{
    if (ssd1306_IsUpdating())
        return;   // previous frame still transferring, skip this refresh

    char text[30];

    ssd1306_Fill(Black);

    ssd1306_SetCursor(0,0);
    ssd1306_WriteString("Motor Monitoring",Font_7x10,White);

    sprintf(text,"Temp : %.1f C",temperature);
    ssd1306_SetCursor(0,18);
    ssd1306_WriteString(text,Font_7x10,White);

    sprintf(text,"Vib  : %.2f mm/s",vibration);
    ssd1306_SetCursor(0,34);
    ssd1306_WriteString(text,Font_7x10,White);

    sprintf(text,"RPM  : %u",rpm);
    ssd1306_SetCursor(0,50);
    ssd1306_WriteString(text,Font_7x10,White);

    ssd1306_UpdateScreen_DMA();   // <-- changed from ssd1306_UpdateScreen()
}

void OLED_ShowFinished(void)
{
    ssd1306_Fill(Black);

    ssd1306_SetCursor(15,15);
    ssd1306_WriteString("Acquisition",Font_11x18,White);

    ssd1306_SetCursor(35,40);
    ssd1306_WriteString("Finished",Font_11x18,White);

    ssd1306_UpdateScreen();
}

void OLED_ShowMessage(char *line1,
                      char *line2)
{
    ssd1306_Fill(Black);

    ssd1306_SetCursor(0,20);
    ssd1306_WriteString(line1,Font_11x18,White);

    ssd1306_SetCursor(0,45);
    ssd1306_WriteString(line2,Font_7x10,White);

    ssd1306_UpdateScreen();
}

