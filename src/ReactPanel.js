import React from 'react'
import PropTypes from 'prop-types'
import Panel from './Panel'

export default class ReactPanel extends React.Component {
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
                    display: this.props.active ? 'block' : 'none'
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
    value: PropTypes.number,
    maxValue: PropTypes.number.isRequired
}
