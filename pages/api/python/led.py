from gpiozero import LED
import time

K = input("Blink speed in seconds? ")
Q = input("How many times? ")
L = input("Green (1) or red (2) light? ")

greenLight = LED(19)
redLight = LED(18)

led = greenLight

if L == 2:
    led = redLight

count =  0
while count < Q:
  led.toggle()
  time.sleep(K)
  led.toggle()
  time.sleep(K)
  count = count + 1
