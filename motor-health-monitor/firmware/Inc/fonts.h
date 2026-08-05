/*
 * fonts.h
 *
 *  Created on: Jul 30, 2026
 *      Author: mohamed
 */

#ifndef INC_FONTS_H_
#define INC_FONTS_H_


#include <stdint.h>

/* Font structure */
typedef struct
{
    const uint16_t *data;
    uint8_t Width;
    uint8_t Height;
} FontDef;

/* Available fonts */
extern FontDef Font_7x10;
extern FontDef Font_11x18;
extern FontDef Font_16x26;


#endif /* INC_FONTS_H_ */
