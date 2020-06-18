import React from 'react'
import './App.css'

import Map from "./Map"

import { wards } from './wards'
import { trail } from './trail'
import { demarcation606 } from './demarcation606'

function App() {
	return (
		<div className="App">
			<Map
				center={[
					41.913631144658794,
					-87.71663546562195,
				]}
				data={wards}
				zoom={14}
				demarcation={demarcation606}
				trail={trail}
			/>
		</div>
	);
}

export default App;
