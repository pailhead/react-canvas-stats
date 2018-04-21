stats.js
========

#### React version of stats.js ####

Please see [the original](https://github.com/mrdoob/stats.js) for a better idea of what this does. There's another react version of this but it hasn't been updated in a long time and renders this with the dom. 

### Usage ###

[![NPM](https://nodei.co/npm/react-canvas-stats.png)](https://npmjs.org/package/react-canvas-stats)

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
### NOTES ###

`Stats.js` has been refactored. The idea is to have it not coupled with the dom, nor the panel instances for that matter. It's responsibilities should be:
- Figure out which `now()` is available.
- Compute miliseconds
- Compute frame rate.
- (memory has been nuked)

The `react` side of things is relying heavily on timestamps. It feels kinda weird but it works. This seems to be an obvious way to trigger a change. For the main component, only the stamp of the last update is needed. The panel's seemed to each need their own, since the numbers could be the same (60fps over and over again) and it seemed like this change wouldn't register. Hence both the value prop, and the time of last update. 

### TODO ###

- custom panel
- clean dependencies
