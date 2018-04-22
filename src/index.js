import React from 'react'
import PropTypes from 'prop-types'

import Stats from './Stats'
import Panel from './Panel'

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

ReactPanel.propTypes = {
    name: PropTypes.string.isRequired,
    fg: PropTypes.string,
    bg: PropTypes.string,
    active: PropTypes.bool,
    timestamp: PropTypes.number,
    value: PropTypes.number
}

const FPS = 'fps'
const MS = 'ms'

const DEFAULT_PANELS = [
    {
        name: 'FPS',
        fg: '#0ff',
        bg: '#002',
        updateOnType: FPS
    },
    {
        name: 'MS',
        fg: '#0f0',
        bg: '#020',
        updateOnType: MS
    }
]

function getKeyValue(name) {
    return `${name}_val`
}

function getKeyTimestamp(name) {
    return `${name}_timestamp`
}

export default class ReactStats extends React.Component {
    state = {
        mode: 0,
        panels: []
    }

    constructor(props) {
        super(props)

        this._callbacks = {
            [FPS]: {},
            [MS]: {}
        }
    }

    _initPanel = panel => {
        const { name, updateOnType } = panel
        const pn = getKeyValue(name)
        const ts = getKeyTimestamp(name)
        const updateType = updateOnType === MS ? MS : FPS

        this.setState({
            [pn]: null,
            [ts]: null
        })

        this._callbacks[updateType][name] = val => {
            this.setState({
                [pn]: val,
                [ts]: Date.now()
            })
        }
    }

    componentDidMount() {
        const { extraPanels } = this.props

        let panels = [...DEFAULT_PANELS]

        if (extraPanels) {
            panels = panels.concat(extraPanels)
        }

        panels.forEach(this._initPanel)

        this.setState({ panels })

        this.stats = new Stats({
            onMSComputed: this._onMSComputed,
            onFpsComputed: this._onFpsComputed
        })
    }

    _onMSComputed = ms => {
        Object.keys(this._callbacks[MS]).forEach(key =>
            this._callbacks[MS][key](ms)
        )
    }

    _onFpsComputed = fps => {
        Object.keys(this._callbacks[FPS]).forEach(key =>
            this._callbacks[FPS][key](fps)
        )
    }

    onClick = () => {
        const mode = ++this.state.mode % this.state.panels.length

        this.setState({ mode })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.timestamp !== this.props.timestamp) {
            this.stats && this.stats.update()
        }
    }

    _renderPanel = (panel, panelIndex) => {
        const { state: { mode }, state } = this
        const { name, fg, bg } = panel

        return (
            <ReactPanel
                key={panelIndex}
                active={mode === panelIndex}
                name={name}
                fg={fg}
                bg={bg}
                value={state[getKeyValue(name)]}
                timestamp={state[getKeyTimestamp(name)]}
            />
        )
    }

    render() {
        const { panels } = this.state

        return (
            <div onClick={this.onClick} style={{ cursor: 'pointer' }}>
                {panels.map(this._renderPanel)}
            </div>
        )
    }
}

ReactStats.propTypes = {
    timestamp: PropTypes.number.isRequired,
    extraPanels: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            fg: PropTypes.string,
            bg: PropTypes.string,
            updateOnType: PropTypes.string
        })
    )
}
