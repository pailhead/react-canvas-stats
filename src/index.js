import React from 'react'
import Stats, { Panel } from './Stats'

class ReactPanel extends React.Component {
    _setCanvas = ref => {
        this._canvas = ref
        if (this._canvas) {
            this._panel = new Panel(
                this._canvas,
                this.props.name,
                this.props.fg,
                this.props.bg
            )
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.timestamp !== prevProps.timestamp) {
            this._panel.update(this.props.value, this.props.maxValue)
        }
    }

    render() {
        return (
            <div
                style={{
                    display: this.props.active ? 'inline-block' : 'none'
                }}
            >
                <canvas ref={this._setCanvas} />
            </div>
        )
    }
}

export default class ReactStats extends React.Component {
    state = {
        mode: 0,
        ms: null,
        fps: null
    }

    componentDidMount() {
        this.stats = new Stats({
            onMSComputed: this.onMSComputed,
            onFpsComputed: this.onFpsComputed
        })
    }

    onMSComputed = ms => {
        this.setState({ ms, msTimestamp: Date.now() })
    }

    onFpsComputed = fps => {
        this.setState({ fps, fpsTimestamp: Date.now() })
    }

    onClick = () => {
        const mode = ++this.state.mode % 2
        this.setState({ mode })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.timestamp !== this.props.timestamp) {
            this.stats && this.stats.update()
        }
    }

    render() {
        const { mode } = this.state
        return (
            <div onClick={this.onClick} style={{ cursor: 'pointer' }}>
                <ReactPanel
                    active={mode === 0}
                    name="FPS"
                    fg="#0ff"
                    bg="#002"
                    value={this.state.fps}
                    timestamp={this.state.fpsTimestamp}
                />
                <ReactPanel
                    active={mode === 1}
                    name="MS"
                    fg="#0f0"
                    bg="#020"
                    value={this.state.ms}
                    timestamp={this.state.msTimestamp}
                />
            </div>
        )
    }
}

// this.fpsPanel = new Panel('FPS', '#0ff', '#002')
// this.msPanel = new Panel('MS', '#0f0', '#020')
