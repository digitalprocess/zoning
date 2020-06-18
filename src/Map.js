import React, { useEffect } from 'react'
import L from 'leaflet'

const Map = ({
	id,
	zoom,
	data,
	trail,
	width,
	height,
	center,
	minZoom,
	maxZoom,
	markers,
	demarcation,
}) => {
	useEffect(() => {
		const map = L.map(id, {
			zoom,
			center,
			layers: [
				L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
					minZoom,
					maxZoom,
				}),
				L.geoJSON(data).bindPopup(layer => {
					const { ward, alderman } = layer.feature.properties

					return (
						`<h2>WARD ${ward}</h2>
						${alderman ? `<h3>${alderman}</h3>` : ''}`
					)
				})
			]
		})

		L.geoJSON(demarcation, {
			style: () => ({
				"weight": 6,
				"opacity": 0.6,
				"color": "red",
				"stroke-width": 8
			})
		}).addTo(map)

		L.geoJSON(trail, {
			style: () => ({
				"weight": 8,
				"opacity": 0.6,
				"color": "green",
				"stroke-width": 8
			})
		}).addTo(map)

		// and for the sake of advertising...
		const brand = L.control({
			position: 'bottomright'
		})
		brand.onAdd = () => {
			const div = L.DomUtil.create('div', 'leaflet-control-attribution')
			div.innerHTML =
				`<a href="https://digitalprocess.github.io/housing/" class="Map-brand"> © West Town GIS</a>`
			return div
		}
		map.addControl(brand)

		// marker
		const CustomIcon = L.Icon.extend({
			options: {
				iconSize: [45, 45],
				shadowSize: [50, 64],
				iconAnchor: [18, 44],
				shadowAnchor: [4, 62],
				popupAnchor: [-3, -50]
			}
		})

		const icon_pin = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve">
		<g>
			<path fill="#00AEEF" stroke-width="3" stroke="white" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9   C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/>
		</g>
			<circle cx="183" cy="187" r="62" stroke="white" stroke-width="3" fill="white" />
		</svg>`

		// For data URI SVG support in Firefox & IE it's necessary to URI encode the string
		// & replace the '#' character with '%23'. `encodeURI()` won't do this which is
		// why `replace()` must be used on the string afterwards.
		const iconUrl = encodeURI("data:image/svg+xml," + icon_pin).replace('#', '%23')
		const markerIcon = new CustomIcon({ iconUrl })

		if (markers) {
			markers.map(marker => (
				L.marker(marker.coordinates, { icon: markerIcon })
					.addTo(map)
					.bindPopup(
						`<div class="Map-popup">
							<address>${marker.title || marker.address || marker.coordinates}</address>
							${marker.subtitle ? `${marker.subtitle}` : ''}
							${marker.template ? `${marker.template}` : ''}
						</div>`
					)
			))
		}

		return () => {// cleanup
			// We need to remove the map on unmount to avoid
			// "Error: Map container is already initialized."
			if (map) map.remove()
		}
	}, [id, data, zoom, center, minZoom, maxZoom, markers, demarcation, trail])

	return (
		<div
			id={id}
			className="Map"
			center={center}
			style={{
				width,
				height,
			}}
		/>
	)
}

Map.defaultProps = {
	id: 'Map',
	zoom: 10,
	width: '100%',
	height: '100vh',
	minZoom: 10,
	maxZoom: 19,
	center: [
		41.88203,
		-87.62780,
	]
}

export default Map
