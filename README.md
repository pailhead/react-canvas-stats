stats.js
========

#### React version of stats.js ####

Please see [the original](https://github.com/mrdoob/stats.js) for a better idea of what this does. There's another react version of this but it hasn't been updated in a long time and renders this with the dom. 

### Usage ###

Only the `MS` and `FPS` panels are available.

Pass a timestamp prop to the component when update needs to occur.


```javascript


import Stats from 'react-canvas-stats'


class Foo extends Component {

	state={ timestamp: null }
	
	onSomeUpdate = ()=>{
		this.setState({timestamp: Date.now()})
	}

	render(){
		<div>
			<Stats
				timestamp={this.state.timestamp}
			/>
		</div>
	}
}

```

