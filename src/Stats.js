/**
 * @author mrdoob / http://mrdoob.com/
 */

/**
 * refactored by @pailhead / http://dusanbosnjak.com
 *
 * responsibilities:
 *
 *    - obtain now()
 *    - compute ms on every update
 *    - gather frame rate over time
 *    - fire appropriate callbacks
 *
 * nuked:
 *    - panel references
 *    - dom references
 *
 * known issues:
 *    - https://github.com/mrdoob/stats.js/issues
 */
import root from 'window-or-global'

export default class Stats {
    constructor({ onFpsComputed, onMSComputed }) {
        
        this.now =
            root.performance && root.performance.now
                ? root.performance.now.bind(root.performance)
                : Date.now.bind(Date)

        this.beginTime = this.now()
        this.prevTime = this.beginTime
        this.frames = 0

        this.onMSComputed = onMSComputed
        this.onFpsComputed = onFpsComputed

        this.REVISION = 1
    }

    begin = () => {
        this.beginTime = this.now()
    }

    end = () => {
        this.frames++

        const time = this.now()

        const ms = time - this.beginTime

        this.onMSComputed(ms)

        if (time >= this.prevTime + 1000) {
            const fps = this.frames * 1000 / (time - this.prevTime)
            this.onFpsComputed(fps)

            this.prevTime = time
            this.frames = 0
        }

        return time
    }

    update = () => {
        this.beginTime = this.end()
    }
}
