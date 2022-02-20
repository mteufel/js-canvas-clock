import ClockMode from "./ClockMode";

let ClockSettings = () => {

    let radius = 50
    let lineWidth = 0.02
    let enableDashes = true
    let dashSizeSmall = 0.05
    let dashSizeBig = 0.1
    let dashOuterDistance = 0.05
    let enableNumbers = false
    let numberSize = 0.15
    let numberFont = 'serif'
    let numberOuterDistance = 0.25
    let hourPointerLength = 0.60
    let minutePointerLength = 0.75
    let secondPointerLength=  0.7
    let secondPointerColor= '#1890FF'
    let secondPointerWidth = 0.01
    let dotRadius = 0.03

    return {
        setRadius: (radius) => this.radius = radius,
        setLineWidth: (lineWidth) => this.lineWidth = lineWidth,
        setEnableDashes: (enableDashes) => this.enableDashes = enableDashes,
        setDashSizeSmall: (dashSizeSmall) => this.dashSizeSmall = dashSizeSmall,
        setDashSizeBig: (dashSizeBig) => this.dashSizeBig = dashSizeBig,
        setDashOuterDistance: (dashOuterDistance) => this.dashOuterDistance = dashOuterDistance,
        setEnableNumbers: (enableNumbers) => this.enableNumbers = enableNumbers,
        setNumberSize: (numberSize) => this.numberSize = numberSize,
        setNumberFont: (numberFont) => this.numberFont = numberFont,
        setNumberOuterDistance: (numberOuterDistance) => this.numberOuterDistance = numberOuterDistance,
        setHourPointerLength: (hourPointerLength) => this.hourPointerLength = hourPointerLength,
        setMinutePointerLength: (minutePointerLength) => this.minutePointerLength = minutePointerLength,
        setSecondPointerLength: (secondPointerLength) => this.secondPointerLength = secondPointerLength,
        setSecondPointerColor: (secondPointerColor) => this.secondPointerColor = secondPointerColor,
        setSecondPointerWidth: (secondPointerWidth) => this.secondPointerWidth = secondPointerWidth,
        setDotRadius: (dotRadius) => this.dotRadius,
        getRadius: () => this.radius,
        getLineWidth: () => this.lineWidth * this.radius,
        areDashesEnabled: () => this.enableDashes,
        getDashSizeSmall: () => this.dashSizeSmall * this.radius,
        getDashSizeBig: () => this.dashSizeBig * this.radius,
        getDashOuterDistance: () => this.dashOuterDistance * this.radius,
        areNumbersEnabled: () => this.enableNumbers,
        getNumberSize: () => this.numberSize * this.radius,
        getNumberFont: () => this.numberFont,
        getNumberOuterDistance: () => this.numberOuterDistance * this.radius,
        getHourPointerLength: () => this.hourPointerLength * this.radius,
        getMinutePointerLength: () => this.minutePointerLength * this.radius,
        getSecondPointerLength: () => this.secondPointerLength * this.radius,
        getSecondPointerColor: () => this.secondPointerColor,
        getSecondPointerWidth: () => this.secondPointerWidth  * this.radius,
        getDotRadius: () => this.dotRadius
    }
}

let Clock = (canvas, x, y, mode, settings, timeFunction) => {

    let _canvas = canvas;
    let _ctx = _canvas.getContext('2d')
    let _x = x
    let _y = y
    let _mode = mode
    let _settings = settings
    let _timeFunction = timeFunction

    const _drawDashes = () => {
        _ctx.save()
        _ctx.beginPath()
        for (let i = 0; i < 60; i++) {
            const length = (i % 5 === 0) ? _settings.getDashSizeBig() : _settings.getDashSizeSmall()
            const xFrom = x + (_settings.getRadius() - _settings.getDashOuterDistance()) * Math.sin(i * (Math.PI / 30))
            const yFrom = y - (_settings.getRadius() -_settings.getDashOuterDistance()) * Math.cos(i * (Math.PI / 30))
            const xTo = x + (_settings.getRadius() - _settings.getDashOuterDistance() - length) * Math.sin(i * (Math.PI / 30))
            const yTo = y - (_settings.getRadius() - _settings.getDashOuterDistance() - length) * Math.cos(i * (Math.PI / 30))
            _ctx.moveTo(xFrom, yFrom)
            _ctx.lineTo(xTo, yTo)
        }
        _ctx.stroke()
        _ctx.restore()
    }

    const _drawNumbers = () => {
        _ctx.save()
        _ctx.textAlign = 'center'
        _ctx.textBaseline = 'middle'
        _ctx.font = _settings.getNumberSize() + 'px ' + _settings.getNumberFont()
        for (let i = 1; i < 13; i++) {
            const numX = _x + (_settings.getRadius() - _settings.getNumberOuterDistance()) * Math.sin(i * (Math.PI / 6))
            const numY = _y - (_settings.getRadius() - _settings.getNumberOuterDistance()) * Math.cos(i * (Math.PI / 6))
            _ctx.fillText('' + i, numX, numY)
        }
        _ctx.restore()
    }

    const _drawPointers = () => {
        const time = _timeFunction()
        let hourXEnd, hourYEnd,
            minuteXEnd, minuteYEnd,
            secondXEnd, secondYEnd

        const totalMinutes = time.hours * 60 + time.minutes
        const totalSeconds = totalMinutes * 60 + time.seconds

        if (_mode === ClockMode.JUMPING) {
            hourXEnd = x + _settings.getHourPointerLength() * Math.sin((totalSeconds / 21600) * Math.PI)
            hourYEnd = y - _settings.getHourPointerLength() * Math.cos((totalSeconds / 21600) * Math.PI)
            minuteXEnd = x + _settings.getMinutePointerLength() * Math.sin((time.minutes / 30) * Math.PI)
            minuteYEnd = y - _settings.getMinutePointerLength() * Math.cos((time.minutes / 30) * Math.PI)
            secondXEnd = x + _settings.getSecondPointerLength() * Math.sin((time.seconds / 30) * Math.PI)
            secondYEnd = y - _settings.getSecondPointerLength() * Math.cos((time.seconds / 30) * Math.PI)
        } else if (_mode === ClockMode.CONTINOUS) {
            hourXEnd = x + _settings.getHourPointerLength() * Math.sin((totalSeconds / 21600) * Math.PI)
            hourYEnd = y - _settings.getHourPointerLength() * Math.cos((totalSeconds / 21600) * Math.PI)
            minuteXEnd = x + _settings.getMinutePointerLength() * Math.sin((totalSeconds / 1800) * Math.PI)
            minuteYEnd = y - _settings.getMinutePointerLength() * Math.cos((totalSeconds / 1800) * Math.PI)
            secondXEnd = x + _settings.getSecondPointerLength() * Math.sin(((time.seconds * 1000 + time.milliseconds) / 30000) * Math.PI)
            secondYEnd = y - _settings.getSecondPointerLength() * Math.cos(((time.seconds * 1000 + time.milliseconds) / 30000) * Math.PI)
        }

        _ctx.save()

        _ctx.beginPath()
        _ctx.moveTo(x, y)
        _ctx.lineTo(hourXEnd, hourYEnd)

        _ctx.moveTo(x, y)
        _ctx.lineTo(minuteXEnd, minuteYEnd)
        _ctx.stroke()

        _ctx.beginPath()
        _ctx.lineWidth = _settings.getSecondPointerWidth()
        _ctx.strokeStyle = _settings.getSecondPointerColor()
        _ctx.moveTo(x, y)
        _ctx.lineTo(secondXEnd, secondYEnd)
        _ctx.stroke()

        _ctx.restore()
    }

    const _drawDot = () => {
        _ctx.beginPath()
        _ctx.arc(x, y, _settings.getDotRadius(), 0, 2 * Math.PI)
        _ctx.fill()
    }

    const _drawArc = () => {
        _ctx.beginPath()
        _ctx.arc(x, y, _settings.getDotRadius(), 0, 2 * Math.PI)
        _ctx.stroke()
    }

    return {
        clearCanvas: () => {
            _ctx.clearRect(0, 0, canvas.width, canvas.height)
        },
        drawClock: () => {
            _ctx.save()
            _ctx.lineWidth = _settings.getLineWidth()
            if (_settings.areDashesEnabled()) _drawDashes()
            if (_settings.areNumbersEnabled()) _drawNumbers()
            _drawPointers()
            _drawDot()
            _drawArc()
            _ctx.restore()
        }
    }

}

let ClockBuilder = () => {
    let _canvas
    let _x
    let _y
    let _mode = ClockMode.JUMPING
    let _settings = ClockSettings()  // enables the builder with some default settings

    // enables the builder with a default time function
    let _timeFunction = () => {
        const today = new Date()
        return {
            hours: today.getHours(),
            minutes: today.getMinutes(),
            seconds: today.getSeconds(),
            milliseconds: today.getMilliseconds()
        }
    }

    return {
        getSettings: () => settings,
        setCanvas: (canvas) => {
            _canvas = canvas
            return this
        },
        setX: (x) => {
            _x = x
            return this
        },
        setY: (y) => {
            _y = y
            return this
        },
        setMode: (mode) => {
            _mode = mode
            return this
        },
        setSettings: (settings) => {
            _settings = settings
            return this
        },
        setTimeFunction: (timeFunction) => {
            _timeFunction = timeFunction
            return this
        },
        build: () => {
            return Clock(_canvas, _x, _y, _mode, _settings, _timeFunction)
        }
    }
}

