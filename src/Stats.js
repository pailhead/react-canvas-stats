/**
 * @author mrdoob / http://mrdoob.com/
 */

export class Panel {
    constructor(canvas, name, fg, bg) {
        this.fg = fg
        this.bg = bg
        this.name = name

        this.min = Infinity
        this.max = 0
        this.round = Math.round

        const PR = this.round(window.devicePixelRatio || 1)
        this.PR = PR

        this.WIDTH = 80 * PR
        this.HEIGHT = 48 * PR
        this.TEXT_X = 3 * PR
        this.TEXT_Y = 2 * PR
        this.GRAPH_X = 3 * PR
        this.GRAPH_Y = 15 * PR
        this.GRAPH_WIDTH = 74 * PR
        this.GRAPH_HEIGHT = 30 * PR

        // const canvas = document.createElement('canvas')
        canvas.width = this.WIDTH
        canvas.height = this.HEIGHT
        canvas.style.cssText = 'width:80px;height:48px'
        this.canvas = canvas
        const context = canvas.getContext('2d')
        context.font = `bold ${9 * PR}px Helvetica,Arial,sans-serif`
        context.textBaseline = 'top'

        context.fillStyle = bg
        context.fillRect(0, 0, this.WIDTH, this.HEIGHT)

        context.fillStyle = fg
        context.fillText(name, this.TEXT_X, this.TEXT_Y)
        context.fillRect(
            this.GRAPH_X,
            this.GRAPH_Y,
            this.GRAPH_WIDTH,
            this.GRAPH_HEIGHT
        )

        context.fillStyle = bg
        context.globalAlpha = 0.9
        context.fillRect(
            this.GRAPH_X,
            this.GRAPH_Y,
            this.GRAPH_WIDTH,
            this.GRAPH_HEIGHT
        )

        this.context = context
    }

    update = (value, maxValue) => {
        this.min = Math.min(this.min, value)
        this.max = Math.max(this.max, value)

        this.context.fillStyle = this.bg
        this.context.globalAlpha = 1
        this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y)
        this.context.fillStyle = this.fg
        this.context.fillText(
            `${this.round(value)} ${this.name} (${this.round(
                this.min
            )}-${this.round(this.max)})`,
            this.TEXT_X,
            this.TEXT_Y
        )

        this.context.drawImage(
            this.canvas,
            this.GRAPH_X + this.PR,
            this.GRAPH_Y,
            this.GRAPH_WIDTH - this.PR,
            this.GRAPH_HEIGHT,
            this.GRAPH_X,
            this.GRAPH_Y,
            this.GRAPH_WIDTH - this.PR,
            this.GRAPH_HEIGHT
        )

        this.context.fillRect(
            this.GRAPH_X + this.GRAPH_WIDTH - this.PR,
            this.GRAPH_Y,
            this.PR,
            this.GRAPH_HEIGHT
        )

        this.context.fillStyle = this.bg
        this.context.globalAlpha = 0.9
        this.context.fillRect(
            this.GRAPH_X + this.GRAPH_WIDTH - this.PR,
            this.GRAPH_Y,
            this.PR,
            this.round((1 - value / maxValue) * this.GRAPH_HEIGHT)
        )
    }
}

export default class Stats {
    constructor({ onFpsComputed, onMSComputed }) {
        this.now = window.performance
            ? window.performance.now.bind(window.performance)
            : Date.now.bind(Date)

        // this.memory = window.performance && window.performance.memory

        this.beginTime = this.now()
        this.prevTime = this.beginTime
        this.frames = 0

        this.onMSComputed = onMSComputed
        this.onFpsComputed = onFpsComputed

        // this.fpsPanel = new Panel('FPS', '#0ff', '#002')
        // this.msPanel = new Panel('MS', '#0f0', '#020')

        // if (this.memory) {
        //     this.memPanel = new Panel('MB', '#f08', '#201')
        //     this.panels.push(this.memPanel.canvas)
        // }

        this.REVISION = 1

        // this.showPanel(this.mode)
    }

    // getPanels() {
    //     return this.panels
    // }

    // showPanel(id) {
    //     this.mode = id
    // }

    begin = () => {
        this.beginTime = this.now()
    }
    end = () => {
        this.frames++

        const time = this.now()

        const ms = time - this.beginTime

        this.onMSComputed(ms)

        // this.msPanel.update(time - this.beginTime, 200)

        if (time >= this.prevTime + 1000) {
            const fps = this.frames * 1000 / (time - this.prevTime)
            this.onFpsComputed(fps)

            // this.fpsPanel.update(
            //     this.frames * 1000 / (time - this.prevTime),
            //     100
            // )

            this.prevTime = time
            this.frames = 0

            // if (this.memPanel) {
            //     const { memory } = this
            //     this.memPanel.update(
            //         memory.usedJSHeapSize / 1048576,
            //         memory.jsHeapSizeLimit / 1048576
            //     )
            // }
        }

        return time
    }

    update = () => {
        this.beginTime = this.end()
    }
}
