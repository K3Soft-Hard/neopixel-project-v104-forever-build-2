radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 3) {
        modeNum = favouriteModeNum
    } else if (receivedNumber == 1) {
        serial.writeLine("=>radioAPressed START")
        changeMode(-1)
        serial.writeLine("=>radioAPressed END")
    } else if (receivedNumber == 2) {
        serial.writeLine("=>radioBPressed START")
        changeMode(1)
        serial.writeLine("=>radioBPressed END")
    }
})
function soundMeter () {
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
    strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Blue))
    soundMap = Math.map(input.soundLevel(), 0, 250, 0, 22)
    if (soundMap > 0) {
        i = 1
        for (let index = 0; index < soundMap; index++) {
            if (i < 11) {
                strip.setPixelColor(i, neopixel.colors(NeoPixelColors.Green))
            } else if (i >= 11 && i <= 13) {
                strip.setPixelColor(i, neopixel.colors(NeoPixelColors.Yellow))
            } else {
                strip.setPixelColor(i, neopixel.colors(NeoPixelColors.Red))
            }
            i += 1
        }
    }
    strip.show()
    basic.pause(30)
}
function flashEffect () {
    if (input.runningTime() >= flashNextTime) {
        if (modeCycle < flashRepeatNum) {
            strip.showColor(neopixel.colors(NeoPixelColors.Blue))
            strip.show()
            basic.pause(randint(10, 20))
            strip.showColor(neopixel.colors(NeoPixelColors.Black))
            basic.pause(randint(15, 40))
            modeCycle += 1
        } else {
            flashNextCycleInit(false)
        }
    }
}
// Dúhový efekt umožňuje rotovať dúhu od farby po farbu vlastnou rýchlosťou
function rainbowEffect () {
    if (modeCycle == 0) {
        modeCycle += 1
    } else {
        strip.rotate(1)
    }
    strip.show()
    basic.pause(modeDelay)
}
function initRainbowEffect (rainbowFrom: number, rainbowTo: number, newModeDelay: number) {
    strip.showRainbow(rainbowFrom, rainbowTo)
    modeDelay = newModeDelay
}
function displayFavouriteMode () {
    if (modeNum == favouriteModeNum) {
        kitronik_VIEW128x64.show("favourite", 7, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    }
}
input.onButtonPressed(Button.A, function () {
    serial.writeLine("=>buttonAPressed START")
    changeMode(-1)
    serial.writeLine("=>buttonAPressed END")
})
function neopixelTimer () {
    if (modeCycle < length) {
        strip.shift(1)
        strip.setPixelColor(0, neopixel.rgb(modeR, modeG, modeB))
        strip.show()
        basic.pause(modeDelay)
        modeCycle += 1
    }
}
function randomEffect () {
    for (let index = 0; index < 4; index++) {
        strip.setPixelColor(randint(0, length - 1), neopixel.rgb(randint(1, 50), randint(1, 50), randint(1, 50)))
        strip.show()
        basic.pause(modeDelay)
    }
}
function circlingEffect (R2: number, G2: number, B2: number, milis2: number) {
    strip.setBrightness(brightness)
    strip.clear()
    for (let index = 0; index < length; index++) {
        strip.shift(1)
        strip.setPixelColor(0, neopixel.rgb(R2, G2, B2))
        strip.show()
        basic.pause(milis2)
    }
    strip.showColor(neopixel.rgb(R2, G2, B2))
    strip.show()
    for (let index = 0; index < length; index++) {
        strip.shift(1)
        strip.setPixelColor(0, neopixel.rgb(0, 0, 0))
        strip.show()
        basic.pause(milis2)
    }
}
function tempetureSensor () {
    temperatureValue = input.temperature()
    tempetureMap = Math.map(temperatureValue, 8, 31, 0, 23)
    kitronik_VIEW128x64.show("" + temperatureValue + "C", 5, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    serial.writeValue("temp", temperatureValue)
    serial.writeValue("tempMap", tempetureMap)
    i2 = 0
    for (let index = 0; index < 24; index++) {
        if (i2 <= tempetureMap) {
            if ((i2 - 2) % 10 == 0) {
                strip.setPixelColor(i2, neopixel.rgb(40, 15, 15))
            } else if ((i2 - 2) % 5 == 0) {
                strip.setPixelColor(i2, neopixel.rgb(15, 40, 15))
            } else {
                strip.setPixelColor(i2, neopixel.rgb(20, 20, 20))
            }
        } else {
            strip.setPixelColor(i2, neopixel.rgb(0, 0, 0))
        }
        i2 += 1
    }
    strip.show()
    basic.pause(125)
}
function tempetureSensor2 () {
    temperatureValue = input.temperature()
    kitronik_VIEW128x64.show("" + temperatureValue + "C", 5, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    serial.writeValue("temp", temperatureValue)
    temperaturePixel = 12 + (temperatureValue - 20)
    if (temperaturePixel > 23) {
        temperaturePixel = 23
    } else if (temperaturePixel < 0) {
        temperaturePixel = 0
    }
    i2 = 0
    for (let index = 0; index < 24; index++) {
        if (i2 == 12) {
            strip.setPixelColor(i2, neopixel.colors(NeoPixelColors.Green))
        } else if (i2 == temperaturePixel) {
            if (temperaturePixel < 12) {
                strip.setPixelColor(i2, neopixel.colors(NeoPixelColors.Blue))
            } else {
                strip.setPixelColor(i2, neopixel.colors(NeoPixelColors.Red))
            }
        } else {
            strip.setPixelColor(i2, neopixel.rgb(0, 0, 0))
        }
        i2 += 1
    }
    strip.show()
    basic.pause(125)
}
// Delay is needed at the end of function, otherwise sound sensing would not be initialized when switching between sound modes
function setSoundModeParams (soundLevel: number, newR: number, newG: number, newB: number, newDelay: number) {
    setModeParams(newR, newG, newB, newDelay)
    minSoundLevel = soundLevel
    basic.pause(200)
}
function infinityCirclingEffect () {
    if (modeCycle < length) {
        strip.shift(1)
        strip.setPixelColor(0, neopixel.rgb(modeR, modeG, modeB))
    } else {
        strip.shift(1)
        strip.setPixelColor(0, neopixel.rgb(0, 0, 0))
    }
    strip.show()
    basic.pause(modeDelay)
    modeCycle += 1
    if (modeCycle >= 2 * length) {
        modeCycle = 0
    }
}
// Otáčanie farby umožňuje otáčať vlastnú farbu RGB vlastnou rýchlosťou
function colorRotation () {
    if (modeCycle == 0) {
        strip.setPixelColor(0, neopixel.rgb(modeR, modeG, modeB))
        modeCycle += 1
    } else {
        strip.rotate(1)
    }
    strip.show()
    basic.pause(modeDelay)
}
function blinkColorBySoundLevel (newR: number, newG: number, newB: number) {
    if (input.soundLevel() > minSoundLevel) {
        strip.showColor(neopixel.rgb(newR, newG, newB))
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
}
// Zväčšuje jas
function increaseBrightness () {
    if (brightness <= 240) {
        brightness += 10
    }
    serial.writeLine("" + brightness)
}
function soundBlink (mode: number) {
    if (mode == 1) {
        blinkColorBySoundLevel(randint(0, 50), randint(0, 50), randint(0, 50))
    } else if (mode == 2) {
        if (input.soundLevel() > minSoundLevel) {
            strip.showRainbow(1, 360)
        } else {
            strip.showColor(neopixel.colors(NeoPixelColors.Black))
        }
    } else if (mode == 3) {
        if (input.soundLevel() > minSoundLevel) {
            strip.setPixelColor(randint(0, length - 1), neopixel.rgb(randint(0, 50), randint(0, 50), randint(0, 50)))
        } else {
            strip.showColor(neopixel.colors(NeoPixelColors.Black))
        }
    } else if (mode == 4) {
        blinkColorBySoundLevel(modeR, modeG, modeB)
    }
    strip.show()
    basic.pause(modeDelay)
}
input.onButtonPressed(Button.AB, function () {
    favouriteModeNum = modeNum
    displayFavouriteMode()
})
input.onButtonPressed(Button.B, function () {
    serial.writeLine("=>buttonBPressed START")
    changeMode(1)
    serial.writeLine("=>buttonBPressed END")
})
function initMode (newModeNum: number) {
    modeNum = newModeNum
    strip.clear()
    strip.setBrightness(brightness)
    modeCycle = 0
    if (modeNum == 0) {
        setSoundModeParams(30, 0, 0, 0, 30)
    } else if (modeNum == 1) {
        setSoundModeParams(30, 0, 0, 0, 30)
    } else if (modeNum == 2) {
        setSoundModeParams(30, 0, 0, 0, 30)
    } else if (modeNum == 3) {
        setSoundModeParams(30, 0, 63, 63, 30)
    } else if (modeNum == 4) {
        setModeParams(63, 0, 63, 40)
    } else if (modeNum == 5) {
        setModeParams(0, 0, 0, 1)
    } else if (modeNum == 6) {
        setModeParams(63, 0, 63, 1000)
    } else if (modeNum == 7) {
        setModeParams(63, 1, 63, 1000)
    } else if (modeNum == 8) {
        flashNextCycleInit(true)
    } else if (modeNum == 9) {
        initRainbowEffect(1, 360, 50)
    } else if (modeNum == 10) {
        initRainbowEffect(1, 360, 0)
    } else if (modeNum == 11) {
        setModeParams(63, 0, 63, 50)
    } else if (modeNum == 12) {
        setModeParams(244, 253, 255, 0)
    } else if (modeNum == 13) {
        setModeParams(255, 255, 255, 0)
    } else if (modeNum == 14) {
        setModeParams(253, 244, 220, 0)
    } else if (modeNum == 17) {
        setSoundModeParams(30, 0, 0, 0, 30)
    } else {
    	
    }
    kitronik_VIEW128x64.clear()
    kitronik_VIEW128x64.show(modeNames[modeNum], 1, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    kitronik_VIEW128x64.show("Mode: " + (modeNum + 1), 2, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    displayFavouriteMode()
}
function neopixelCountDown () {
    if (modeCycle <= length) {
        if (modeCycle == 0) {
            strip.showColor(neopixel.rgb(modeR, modeG, modeB))
        } else {
            strip.shift(1)
            strip.setPixelColor(0, neopixel.rgb(0, 0, 0))
        }
        strip.show()
        basic.pause(modeDelay)
        modeCycle += 1
    }
}
function runModeCycle (num: number) {
    if (modeNum == 0) {
        soundBlink(1)
    } else if (modeNum == 1) {
        soundBlink(2)
    } else if (modeNum == 2) {
        soundBlink(3)
    } else if (modeNum == 3) {
        soundBlink(4)
    } else if (modeNum == 4) {
        infinityCirclingEffect()
    } else if (modeNum == 5) {
        randomEffect()
    } else if (modeNum == 6) {
        neopixelTimer()
    } else if (modeNum == 7) {
        neopixelCountDown()
    } else if (modeNum == 8) {
        flashEffect()
    } else if (modeNum == 9) {
        rainbowEffect()
    } else if (modeNum == 10) {
        rainbowColor()
    } else if (modeNum == 11) {
        colorRotation()
    } else if (modeNum >= 12 && modeNum <= 14) {
        showColor()
    } else if (modeNum == 15) {
        tempetureSensor()
    } else if (modeNum == 16) {
        tempetureSensor2()
    } else if (modeNum == 17) {
        soundMeter()
    } else {
    	
    }
}
// Nastaveniefarby nastavuje vlastnú farbu RGB
function setColor (R6: number, G6: number, B6: number) {
    strip.clear()
    strip.setBrightness(brightness)
    strip.showColor(neopixel.rgb(R6, G6, B6))
    strip.show()
}
function showColor () {
    if (modeCycle == 0) {
        strip.showColor(neopixel.rgb(modeR, modeG, modeB))
        strip.show()
        modeCycle += 1
    }
}
function setModeParams (newModeR: number, newModeG: number, newModeB: number, newModeDelay: number) {
    modeR = newModeR
    modeG = newModeG
    modeB = newModeB
    modeDelay = newModeDelay
}
// Dúha vykresľuje na neopixeli dúhu
function rainbowColor () {
    if (modeCycle == 0) {
        strip.show()
        modeCycle += 1
    }
}
function flashNextCycleInit (setNow: boolean) {
    if (setNow) {
        flashNextTime = input.runningTime()
    } else {
        flashNextTime = input.runningTime() + randint(1500, 5000)
    }
    flashRepeatNum = randint(3, 10)
    modeCycle = 0
}
// Zmenšuje jas
function decreaseBrightness () {
    if (brightness >= 10) {
        brightness += -10
    }
    serial.writeLine("" + brightness)
}
function changeMode (num: number) {
    serial.writeLine("=>changeMode")
    myModeNum = modeNum
    myModeNum += num
    if (myModeNum < 0) {
        myModeNum = modeNames.length - 1
    } else if (myModeNum >= modeNames.length) {
        myModeNum = 0
    }
    modeNum = myModeNum
    serial.writeValue("modeNum", modeNum)
}
function initialSetup (myLength: number) {
    radio.setGroup(54)
    serial.redirectToUSB()
    length = myLength
    strip = neopixel.create(DigitalPin.P0, length, NeoPixelMode.RGB)
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
    brightness = 50
    kitronik_VIEW128x64.show("Neopixel", 1, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    kitronik_VIEW128x64.show("K3Soft&Hard", 3, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    kitronik_VIEW128x64.show("Neopixel " + ("" + length), 4, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    basic.pause(2500)
    kitronik_VIEW128x64.clear()
    initModes()
}
function initModes () {
    modeNames = [
    "soundBlink 1",
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
    "colorRotation",
    "coolWhite",
    "naturalWhite",
    "warmWhite",
    "tempetureSensor",
    "tempetureSensor2",
    "soundMeter"
    ]
    lastModeNum = -1
    modeNum = 4
}
let lastModeNum = 0
let myModeNum = 0
let modeNames: string[] = []
let minSoundLevel = 0
let temperaturePixel = 0
let i2 = 0
let tempetureMap = 0
let temperatureValue = 0
let brightness = 0
let modeB = 0
let modeG = 0
let modeR = 0
let length = 0
let modeDelay = 0
let flashRepeatNum = 0
let modeCycle = 0
let flashNextTime = 0
let i = 0
let soundMap = 0
let strip: neopixel.Strip = null
let favouriteModeNum = 0
let modeNum = 0
initialSetup(24)
basic.forever(function () {
    if (lastModeNum != modeNum) {
        initMode(modeNum)
        lastModeNum = modeNum
    }
    runModeCycle(modeNum)
})
