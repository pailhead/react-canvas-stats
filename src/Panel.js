/**
 * @author mrdoob / http://mrdoob.com/
 *
 * refactored by @pailhead / http://dusanbosnjak.com
 */

/**
 * responsibilities:
 *    - draw stuff to a provided canvas (the original creates it's own, and couldnt figure out a way to integrate it with react)
 *    - obtain devicePixelRatio
 *
 * known issues:
 *    - https://github.com/mrdoob/stats.js/issues
 */

export default class Panel {
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
