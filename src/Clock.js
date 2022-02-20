
const ClockMode = {
    JUMPING: 'jumping',
    CONTINOUS: 'continous'
}

class ClockSettings {
    constructor() {
        this.radius = 50
        this.lineWidth = 0.02
        this.enableDashes = true
        this.dashSizeSmall = 0.05
        this.dashSizeBig = 0.1
        this.dashOuterDistance = 0.05
        this.enableNumbers = true
        this.numberSize = 0.12
        this.numberFont = 'sans-serif'
        this.numberOuterDistance = 0.25
        this.hourPointerLength = 0.60
        this.minutePointerLength = 0.75
        this.secondPointerLength=  0.7
        this.secondPointerColor= '#1890FF'
        this.secondPointerWidth = 0.01
        this.dotRadius = 0.03

    }

    setRadius(value) {
        this.radius = value
    }

    setLineWidth(value) {
        this.lineWidth = value
    }

    setEnableDashes(value) {
        this.enableDashes = value
    }

    setDashSizeSmall(value) {
        this.dashSizeSmall = value
    }

    setDashSizeBig(value) {
        this.dashSizeBig = value
    }

    setDashOuterDistance(value) {
        this.dashOuterDistance = value
    }

    setEnableNumbers(value) {
        console.log('aufgerufen', value)
        this.enableNumbers = value
    }

    setNumberSize(value) {
        this.numberSize = value
    }

    setNumberFont(value) {
        this.numberFont = value
    }

    setNumberOuterDistance(value) {
        this.numberOuterDistance = value
    }

    setHourPointerLength(value) {
        this.hourPointerLength = value
    }

    setMinutePointerLength(value) {
        this.minutePointerLength = value
    }

    setSecondPointerLength(value) {
        this.secondPointerLength = value
    }

    setSecondPointerColor(value) {
        this.secondPointerColor = value
    }

    setSecondPointerWidth(value) {
        this.secondPointerWidth = value
    }

    setDotRadius(value) {
        this.dotRadius = value
    }

    getRadius() {
        return this.radius
    }

    getLineWidth() {
        return this.lineWidth * this.radius
    }

    areDashesEnabled() {
        return this.enableDashes;
    }

    getDashSizeSmall() {
        return this.dashSizeSmall * this.radius
    }

    getDashSizeBig() {
        return this.dashSizeBig * this.radius;
    }

    getDashOuterDistance() {
        return this.dashOuterDistance * this.radius;
    }

    areNumbersEnabled() {
        return this.enableNumbers;
    }

    getNumberSize() {
        return this.numberSize * this.radius;
    }

    getNumberFont() {
        return this.numberFont;
    }

    getNumberOuterDistance() {
        return this.numberOuterDistance * this.radius;
    }

    getHourPointerLength() {
        return this.hourPointerLength * this.radius;
    }

    getMinutePointerLength() {
        return this.minutePointerLength * this.radius;
    }

    getSecondPointerLength() {
        return this.secondPointerLength * this.radius;
    }

    getSecondPointerColor() {
        return this.secondPointerColor;
    }

    getSecondPointerWidth() {
        return this.secondPointerWidth * this.radius;
    }

    getDotRadius() {
        return this.dotRadius;
    }

}

class Clock {
    constructor(canvas, x, y, mode, settings, timeFunction) {
        this.canvas = canvas;
        this.x = x
        this.y = y
        this.mode = mode
        this.settings = settings
        this.timeFunction = timeFunction
        this.ctx = this.canvas.getContext('2d')
    }

    drawDashes() {
        this.ctx.save()
        this.ctx.beginPath()
        for (let i = 0; i < 60; i++) {
            const length = (i % 5 === 0) ? this.settings.getDashSizeBig() : this.settings.getDashSizeSmall()
            const xFrom = this.x + (this.settings.getRadius() - this.settings.getDashOuterDistance()) * Math.sin(i * (Math.PI / 30))
            const yFrom = this.y - (this.settings.getRadius() - this.settings.getDashOuterDistance()) * Math.cos(i * (Math.PI / 30))
            const xTo = this.x + (this.settings.getRadius() - this.settings.getDashOuterDistance() - length) * Math.sin(i * (Math.PI / 30))
            const yTo = this.y - (this.settings.getRadius() - this.settings.getDashOuterDistance() - length) * Math.cos(i * (Math.PI / 30))
            this.ctx.moveTo(xFrom, yFrom)
            this.ctx.lineTo(xTo, yTo)
        }
        this.ctx.stroke()
        this.ctx.restore()
    }

    drawNumbers() {
        this.ctx.save()
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = this.settings.getNumberSize() + 'px ' + this.settings.getNumberFont()
        for (let i = 1; i < 13; i++) {
            const numX = this.x + (this.settings.getRadius() - this.settings.getNumberOuterDistance()) * Math.sin(i * (Math.PI / 6))
            const numY = this.y - (this.settings.getRadius() - this.settings.getNumberOuterDistance()) * Math.cos(i * (Math.PI / 6))
            this.ctx.fillText('' + i, numX, numY)
        }
        this.ctx.restore()
    }

    drawPointers() {
        const time = this.timeFunction()
        let hourXEnd, hourYEnd,
            minuteXEnd, minuteYEnd,
            secondXEnd, secondYEnd

        const totalMinutes = time.hours * 60 + time.minutes
        const totalSeconds = totalMinutes * 60 + time.seconds

        if (this.mode === ClockMode.JUMPING) {
            hourXEnd = this.x + this.settings.getHourPointerLength() * Math.sin((totalSeconds / 21600) * Math.PI)
            hourYEnd = this.y - this.settings.getHourPointerLength() * Math.cos((totalSeconds / 21600) * Math.PI)
            minuteXEnd = this.x + this.settings.getMinutePointerLength() * Math.sin((time.minutes / 30) * Math.PI)
            minuteYEnd = this.y - this.settings.getMinutePointerLength() * Math.cos((time.minutes / 30) * Math.PI)
            secondXEnd = this.x + this.settings.getSecondPointerLength() * Math.sin((time.seconds / 30) * Math.PI)
            secondYEnd = this.y - this.settings.getSecondPointerLength() * Math.cos((time.seconds / 30) * Math.PI)
        } else if (this.mode === ClockMode.CONTINOUS) {
            hourXEnd = this.x + this.settings.getHourPointerLength() * Math.sin((totalSeconds / 21600) * Math.PI)
            hourYEnd = this.y - this.settings.getHourPointerLength() * Math.cos((totalSeconds / 21600) * Math.PI)
            minuteXEnd = this.x + this.settings.getMinutePointerLength() * Math.sin((totalSeconds / 1800) * Math.PI)
            minuteYEnd = this.y - this.settings.getMinutePointerLength() * Math.cos((totalSeconds / 1800) * Math.PI)
            secondXEnd = this.x + this.settings.getSecondPointerLength() * Math.sin(((time.seconds * 1000 + time.milliseconds) / 30000) * Math.PI)
            secondYEnd = this.y - this.settings.getSecondPointerLength() * Math.cos(((time.seconds * 1000 + time.milliseconds) / 30000) * Math.PI)
        }

        this.ctx.save()

        this.ctx.beginPath()
        this.ctx.moveTo(this.x, this.y)
        this.ctx.lineTo(hourXEnd, hourYEnd)

        this.ctx.moveTo(this.x, this.y)
        this.ctx.lineTo(minuteXEnd, minuteYEnd)
        this.ctx.stroke()

        this.ctx.beginPath()
        this.ctx.lineWidth = this.settings.getSecondPointerWidth()
        this.ctx.strokeStyle = this.settings.getSecondPointerColor()
        this.ctx.moveTo(this.x, this.y)
        this.ctx.lineTo(secondXEnd, secondYEnd)
        this.ctx.stroke()

        this.ctx.restore()
    }

    drawDot() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.settings.getDotRadius(), 0, 2 * Math.PI)
        this.ctx.fill()
    }

    drawArc = () => {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.settings.getDotRadius(), 0, 2 * Math.PI)
        this.ctx.stroke()
    }

    getSettings() {
        return this.settings
    }

    setX(x) {
        this.x = x
    }

    setY(y) {
        this.y = y
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    drawClock() {
        this.ctx.save()
        this.ctx.lineWidth = this.settings.getLineWidth()
        if (this.settings.areDashesEnabled()) this.drawDashes()
        if (this.settings.areNumbersEnabled()) this.drawNumbers()
        this.drawPointers()
        this.drawDot()
        this.drawArc()
        this.ctx.restore()
    }

}

class ClockBuilder {
    constructor() {
        this.canvas = null
        this.x = 0
        this.y = 0
        this.mode = ClockMode.JUMPING
        this.settings = new ClockSettings()    // enables the builder with some default settings

        // enables the builder with a default time function
        this.timeFunction = () => {
            const today = new Date()
            return {
                hours: today.getHours(),
                minutes: today.getMinutes(),
                seconds: today.getSeconds(),
                milliseconds: today.getMilliseconds()
            }
        }
    }

    setCanvas(canvas) {
        this.canvas = canvas
        return this
    }

    setX(x) {
        this.x = x
        return this
    }

    setY(y) {
        this.y = y
        return this
    }

    setMode(mode) {
        this.mode = mode
        return this
    }

    setSettings(settings) {
        this.settings = settings
        return this
    }

    setTimeFunction(timeFunction) {
        this.timeFunction = timeFunction
        return this
    }

    build() {
        return new Clock(this.canvas, this.x, this.y, this.mode, this.settings, this.timeFunction)
    }
}


export { ClockMode, ClockSettings, Clock, ClockBuilder }