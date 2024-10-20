"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
    zoom: 10,
}

const Map = (props: MapProps) => {
    const { zoom = defaults.zoom, posix } = props;
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | LatLngTuple>(posix); // Initial marker position

    // Hook to handle map events
    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng; // Get the latitude and longitude
                setMarkerPosition([lat, lng]); // Update marker position
                console.log(lat, lng)
            },
        });

        return null; // No UI to render
    };

    return (
        <MapContainer
            center={markerPosition}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler /> {/* Include the click handler */}
            <Marker position={markerPosition} draggable={false}>
                <Popup>You clicked here!</Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map;
