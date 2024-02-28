def flashEffect():
    global modeStatus
    strip.clear()
    strip.set_brightness(brightness)
    while modeStatus == 1:
        basic.pause(randint(1500, 3500))
        for index in range(randint(6, 9)):
            strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
            strip.show()
            basic.pause(20)
            strip.show_color(neopixel.colors(NeoPixelColors.BLACK))
            basic.pause(20)
            if modeStatus != 1:
                break
        if modeStatus != 1:
            break
    modeStatus = 0

def on_button_pressed_a():
    serial.write_line("=>buttonAPressed START")
    changeMode(-1)
    serial.write_line("=>buttonAPressed END")
input.on_button_pressed(Button.A, on_button_pressed_a)

def neopixelTimer(R: number, G: number, B: number, milis: number):
    global modeStatus
    strip.clear()
    strip.set_brightness(brightness)
    while modeStatus == 1:
        strip.shift(1)
        strip.set_pixel_color(0, neopixel.rgb(R, G, B))
        strip.show()
        basic.pause(milis)
    modeStatus = 0
def randomEffect():
    global modeStatus
    strip.set_brightness(brightness)
    while modeStatus == 1:
        strip.set_pixel_color(randint(0, length - 1),
            neopixel.rgb(randint(1, 50), randint(1, 50), randint(1, 50)))
        strip.show()
        basic.pause(1)
    modeStatus = 0
def circlingEffect(R2: number, G2: number, B2: number, milis2: number):
    strip.set_brightness(brightness)
    strip.clear()
    for index2 in range(length):
        strip.shift(1)
        strip.set_pixel_color(0, neopixel.rgb(R2, G2, B2))
        strip.show()
        basic.pause(milis2)
    strip.show_color(neopixel.rgb(R2, G2, B2))
    strip.show()
    for index3 in range(length):
        strip.shift(1)
        strip.set_pixel_color(0, neopixel.rgb(0, 0, 0))
        strip.show()
        basic.pause(milis2)
def infinityCirclingEffect(R3: number, G3: number, B3: number, milis3: number):
    global modeStatus
    strip.set_brightness(brightness)
    strip.clear()
    while modeStatus == 1:
        for index4 in range(length):
            strip.shift(1)
            strip.set_pixel_color(0, neopixel.rgb(R3, G3, B3))
            strip.show()
            basic.pause(milis3)
            if modeStatus != 1:
                break
        if modeStatus != 1:
            break
        strip.show_color(neopixel.rgb(R3, G3, B3))
        strip.show()
        for index5 in range(length):
            strip.shift(1)
            strip.set_pixel_color(0, neopixel.rgb(0, 0, 0))
            strip.show()
            basic.pause(milis3)
            if modeStatus != 1:
                break
        if modeStatus != 1:
            break
    modeStatus = 0
# Otáčanie farby umožňuje otáčať vlastnú farbu RGB vlastnou rýchlosťou
def colorRotation(R4: number, G4: number, B4: number, milis4: number):
    global modeStatus
    strip.set_brightness(brightness)
    strip.clear()
    strip.set_pixel_color(0, neopixel.rgb(R4, G4, B4))
    strip.show()
    while modeStatus == 1:
        basic.pause(milis4)
        strip.rotate(1)
        strip.show()
    modeStatus = 0
# Zväčšuje jas
def increaseBrightness():
    global brightness
    if brightness <= 240:
        brightness += 10
    serial.write_line("" + str((brightness)))
def soundBlink(minsound: number, mode: number, R5: number, G5: number, B5: number):
    global modeStatus
    strip.set_brightness(brightness)
    while modeStatus == 1:
        if mode == 1:
            if minsound < input.sound_level():
                strip.show_color(neopixel.rgb(randint(0, 50), randint(0, 50), randint(0, 50)))
            else:
                strip.show_color(neopixel.colors(NeoPixelColors.BLACK))
        elif mode == 2:
            if minsound < input.sound_level():
                strip.show_rainbow(1, 360)
            else:
                strip.show_color(neopixel.colors(NeoPixelColors.BLACK))
        elif mode == 3:
            if minsound < input.sound_level():
                strip.set_pixel_color(randint(0, length - 1),
                    neopixel.rgb(randint(0, 50), randint(0, 50), randint(0, 50)))
            else:
                strip.show_color(neopixel.colors(NeoPixelColors.BLACK))
        elif mode == 4:
            if minsound < input.sound_level():
                strip.show_color(neopixel.rgb(R5, G5, B5))
            else:
                strip.show_color(neopixel.colors(NeoPixelColors.BLACK))
    modeStatus = 0

def on_button_pressed_ab():
    control.reset()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    serial.write_line("=>buttonBPressed START")
    changeMode(1)
    serial.write_line("=>buttonBPressed END")
input.on_button_pressed(Button.B, on_button_pressed_b)

def setMode(newModeNumber: number):
    global modeNum, modeStatus
    serial.write_line("=>setMode START: " + str(newModeNumber))
    modeNum = newModeNumber
    kitronik_VIEW128x64.clear()
    kitronik_VIEW128x64.show(modeNames[modeNum],
        1,
        kitronik_VIEW128x64.ShowAlign.CENTRE,
        kitronik_VIEW128x64.FontSelection.NORMAL)
    kitronik_VIEW128x64.show("Mode: " + str(modeNum),
        2,
        kitronik_VIEW128x64.ShowAlign.CENTRE,
        kitronik_VIEW128x64.FontSelection.NORMAL)
    modeStatus = 1
    serial.write_value("modeNum", modeNum)
    if modeNum == 0:
        soundBlink(10, 1, 1, 1, 1)
    elif modeNum == 1:
        soundBlink(10, 2, 1, 1, 1)
    elif modeNum == 2:
        soundBlink(10, 3, 1, 1, 1)
    elif modeNum == 3:
        soundBlink(10, 4, 0, 10, 10)
    elif modeNum == 4:
        infinityCirclingEffect(63, 0, 63, 40)
    elif modeNum == 5:
        randomEffect()
    elif modeNum == 6:
        neopixelTimer(63, 0, 63, 50)
    elif modeNum == 7:
        neopixelCountdown(63, 1, 63, 50)
    elif modeNum == 8:
        flashEffect()
    elif modeNum == 9:
        rainbovEffect(1, 360, 50)
    elif modeNum == 10:
        rainbowColor(1, 360)
    elif modeNum == 11:
        colorRotation(63, 0, 63, 50)
    basic.pause(50)
    serial.write_line("=>setMode END: " + str(newModeNumber))
# Dúhový efekt umožňuje rotovať dúhu od farby po farbu vlastnou rýchlosťou
def rainbovEffect(_from: number, to: number, milis5: number):
    global modeStatus
    strip.set_brightness(brightness)
    strip.clear()
    strip.show_rainbow(_from, to)
    while modeStatus == 5:
        basic.pause(milis5)
        strip.rotate(1)
        strip.show()
    modeStatus = 0

def on_logo_touched():
    waitUntilStop()
input.on_logo_event(TouchButtonEvent.TOUCHED, on_logo_touched)

# Nastaveniefarby nastavuje vlastnú farbu RGB
def setColor(R6: number, G6: number, B6: number):
    strip.clear()
    strip.set_brightness(brightness)
    strip.show_color(neopixel.rgb(R6, G6, B6))
    strip.show()
# Dúha vykresľuje na neopixeli dúhu
def rainbowColor(_from2: number, to2: number):
    strip.clear()
    strip.set_brightness(brightness)
    strip.show_rainbow(_from2, to2)
    strip.show()
# Zmenšuje jas
def decreaseBrightness():
    global brightness
    if brightness >= 10:
        brightness += -10
    serial.write_line("" + str((brightness)))
def changeMode(num: number):
    global myModeNum, modeNum
    serial.write_line("=>changeMode")
    serial.write_value("modeNum", modeNum)
    serial.write_value("modeStatus", modeStatus)
    waitUntilStop()
    serial.write_value("modeStatus", modeStatus)
    myModeNum = modeNum
    myModeNum += num
    if myModeNum < 0:
        myModeNum = len(modeNames) - 1
    elif myModeNum >= len(modeNames):
        myModeNum = 0
    modeNum = myModeNum
    serial.write_value("modeNum", modeNum)
    setMode(modeNum)
def waitUntilStop():
    global modeStatus
    if modeStatus == 1:
        # modeRunning
        # -1 - try to stop running
        # 0  - running stopped
        # 1  - run
        modeStatus = -1
    if modeStatus == -1:
        kitronik_VIEW128x64.show("Waiting...",
            4,
            kitronik_VIEW128x64.ShowAlign.CENTRE,
            kitronik_VIEW128x64.FontSelection.BIG)
        # Wait until mode completes
        while modeStatus == -1:
            basic.pause(50)
        kitronik_VIEW128x64.clear()
def initialSetup(myLength: number):
    global length, strip, brightness
    serial.redirect_to_usb()
    length = myLength
    strip = neopixel.create(DigitalPin.P0, length, NeoPixelMode.RGB)
    strip.show_color(neopixel.colors(NeoPixelColors.BLACK))
    brightness = 50
    kitronik_VIEW128x64.show("Neopixel",
        1,
        kitronik_VIEW128x64.ShowAlign.CENTRE,
        kitronik_VIEW128x64.FontSelection.BIG)
    kitronik_VIEW128x64.show("K3Soft&Hard",
        3,
        kitronik_VIEW128x64.ShowAlign.LEFT,
        kitronik_VIEW128x64.FontSelection.NORMAL)
    kitronik_VIEW128x64.show("Neopixel " + str(length),
        4,
        kitronik_VIEW128x64.ShowAlign.LEFT,
        kitronik_VIEW128x64.FontSelection.NORMAL)
    basic.pause(2500)
    kitronik_VIEW128x64.clear()
    initModes()
    setMode(4)
def initModes():
    global modeNum, modeStatus, modeNames
    modeNum = 0
    modeStatus = 0
    modeNames = ["soundBlink 1",
        "soundBlink 2",
        "soundBlink 3",
        "soundBlink 4",
        "infinityCirclingEffect",
        "randomEffect",
        "neopixelTimer",
        "neopixelCountdown",
        "flashEffect",
        "rainbovEffect",
        "rainbowColor",
        "colorRotation"]
def neopixelCountdown(R7: number, G7: number, B7: number, milis6: number):
    global modeStatus
    strip.clear()
    strip.set_brightness(brightness)
    strip.show_color(neopixel.rgb(R7, G7, B7))
    strip.show()
    while modeStatus == 1:
        strip.shift(1)
        strip.set_pixel_color(0, neopixel.rgb(0, 0, 0))
        strip.show()
        basic.pause(milis6)
    modeStatus = 0
myModeNum = 0
modeNames: List[str] = []
modeNum = 0
length = 0
modeStatus = 0
brightness = 0
strip: neopixel.Strip = None
initialSetup(24)