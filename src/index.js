import React from 'react'
import PropTypes from 'prop-types'

import ReactPanel from './ReactPanel'
import Stats from './Stats'

const FPS = 'fps'
const MS = 'ms'

const DEFAULT_PANELS = [
    {
        name: 'FPS',
        fg: '#0ff',
        bg: '#002',
        updateOnType: FPS,
        maxValue: 60
    },
    {
        name: 'MS',
        fg: '#0f0',
        bg: '#020',
        updateOnType: MS,
        maxValue: 200
    }
]

function getKeyValue(name) {
    return `${name}_val`
}

function getKeyMaxValue(name) {
    return `${name}_MaxVal`
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
            [FPS]: [],
            [MS]: []
        }
    }

    _initPanel = panel => {
        const { name, updateOnType, updateCallback, maxValue } = panel
        const { fpsMax, msMax } = this.props
        const pn = getKeyValue(name)
        const pm = getKeyMaxValue(name)
        const ts = getKeyTimestamp(name)
        const updateType = updateOnType === MS ? MS : FPS

        let _maxValue

        if (name === 'FPS' && fpsMax) {
            _maxValue = fpsMax
        } else if (name === 'MS' && msMax) {
            _maxValue = msMax
        } else {
            _maxValue = maxValue
        }

        this.setState({
            [pn]: null,
            [pm]: maxValue,
            [ts]: null
        })

        this._callbacks[updateType].push(val => {
            let _val = val
            if (updateCallback) {
                _val = updateCallback(val)
            }
            this.setState({
                [pn]: _val,
                [ts]: Date.now()
            })
        })
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
        for (let i = 0; i < this._callbacks[MS].length; i++) {
            this._callbacks[MS][i](ms)
        }
    }

    _onFpsComputed = fps => {
        for (let i = 0; i < this._callbacks[FPS].length; i++) {
            this._callbacks[FPS][i](fps)
        }
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
                maxValue={state[getKeyMaxValue(name)]}
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
/**
  timestamp - triggers updates, pass a Date.now() when you would call update() in the original
  
  fpsMax - override default max of 60 (optional)

  msMax - override default max of 200 (optional)

  extraPanels - an object that defines a panel with the shape of:
    name - name of the panel
    fg - foreground color (optional)
    bg - background color (optional)
    maxValue - scale of the chart 
    updateOnType - stats has two events, when miliseconds are computed, and when fps is aggregated and computed ('fps' || 'ms' )
    updateCallback - a function that takes the value (ms || fps) as an argument and returns the new value that you compute

    TODO: ^ add this to docs
 */
ReactStats.propTypes = {
    timestamp: PropTypes.number.isRequired,
    fpsMax: PropTypes.number,
    msMax: PropTypes.number,
    extraPanels: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            fg: PropTypes.string,
            bg: PropTypes.string,
            maxValue: PropTypes.number.isRequired,
            updateOnType: PropTypes.string,
            updateCallback: PropTypes.func.isRequired
        })
    )
}
