#include "Particle.h"
#include "neopixel.h"

SYSTEM_MODE(AUTOMATIC);

// IMPORTANT: Set pixel COUNT, PIN and TYPE
#define PIXEL_PIN D7
#define PIXEL_COUNT 30
#define PIXEL_TYPE WS2812B

Adafruit_NeoPixel strip(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

// Prototypes for local build, ok to leave in for Build IDE
// void rainbow(uint8_t wait);
// uint32_t Wheel(byte WheelPos);
bool cycle = false;

void setup()
{
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  Particle.function("off", setOff);
  Particle.function("rainbowCycle", setRainbow);
  Particle.function("color", setColor);
}

void loop()
{
   if(cycle)
    rainbow(20);
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
  if (!cycle){
    setOff("off");
  }
}

int setColor(String color) {
    uint16_t i;
    if(color == "red") {
        for(i=0; i<strip.numPixels(); i++) {
         strip.setPixelColor(i, strip.Color(255, 0, 0));
        }
        strip.show();
        return 1;
    } else if(color == "green") {
        for(i=0; i<strip.numPixels(); i++) {
         strip.setPixelColor(i, strip.Color(0, 255, 0));
        }
        strip.show();
        return 1;
    } else if(color == "blue") {
        for(i=0; i<strip.numPixels(); i++) {
         strip.setPixelColor(i, strip.Color(0, 0, 255));
        }
        strip.show();
        return 1;
    } else if(color == "white") {
        for(i=0; i<strip.numPixels(); i++) {
         strip.setPixelColor(i, strip.Color(255, 255, 255));
        }
        strip.show();
        return 1;
    }
    return -1;
}

// Set strip to off;
int setOff(String command){
    uint16_t i;
    if(command == "off"){
        cycle = false;
        for(i=0; i<strip.numPixels(); i++) {
         strip.setPixelColor(i, 0);
        }
        strip.show();
        return 1;
    }
    return -1;
}

// Set strip to off;
int setRainbow(String command){
    uint16_t i;
    if(command == "cycle") {
       cycle = true;
       return 1;
    }
    return -1;
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  if(WheelPos < 85) {
   return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
}