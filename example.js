import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import ReactStats from 'react-canvas-stats'

class App extends Component {
    state = { timestamp: Date.now() }

    constructor() {
        super()

        const memory = window.performance && window.performance.memory

        if (memory) {
            this._extraPanels = [
                {
                    name: 'MB',
                    fg: '#f08',
                    bg: '#201',
                    updateOnType: 'fps',
                    maxValue: memory.jsHeapSizeLimit / 1048576,
                    updateCallback: val => memory.usedJSHeapSize / 1048576
                }
            ]
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ timestamp: Date.now() })
        }, 30)
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <ReactStats
                    timestamp={this.state.timestamp}
                    extraPanels={this._extraPanels}
                />
            </div>
        )
    }
}

export default App
