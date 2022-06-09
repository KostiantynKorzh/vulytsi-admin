import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapGL, { Layer, Marker, Source } from "@urbica/react-map-gl";
import { Button, ButtonGroup } from "@mui/material";

let isDeletingMarker = false;

export const Map = ({coords, setCoords, centerCoords, setCenterCoords}) => {
    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    const [ selectedCoordsForNewStreet, setSelectedCoordsForNewStreet ] = useState([]);
    const [ matchingCoords, setMatchingCoords ] = useState();
    const [ isChoosingCenter, setIsChoosingCenter ] = useState(false);
    const [ streetCenterCoords, setStreetCenterCoords ] = useState();

    const [ viewport, setViewport ] = useState({
        latitude: 50.45056,
        longitude: 30.52428,
        zoom: 11
    });

    useEffect(() => {
        if (coords) {
            setMatchingCoords({coordinates: coords, type: "LineString"});
        }
    }, [ coords ])

    useEffect(() => {
        if (centerCoords) {
            setStreetCenterCoords(centerCoords);
        }
    }, [ centerCoords ])

    async function getMatch() {
        const coords = selectedCoordsForNewStreet.map(coord => [ coord.lng, coord.lat ]);
        const radiuses = selectedCoordsForNewStreet.map(() => 25).join(';');
        const query = await fetch(`https://api.mapbox.com/matching/v5/mapbox/driving/${coords.join(';')}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${accessToken}`, {method: 'GET'});
        const response = await query.json();
        if (response.code !== 'Ok') {
            alert(`${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`);
            return;
        }
        const resp = response.matchings[0].geometry;
        setMatchingCoords(resp);
    }

    const streetSourceData = {
        type: "Feature", properties: {}, geometry: matchingCoords
    };

    return (
        <div
            style={{
                display: "flex"
            }}
        >
            <MapGL
                accessToken={accessToken}
                mapStyle="mapbox://styles/mapbox/dark-v10"
                style={{width: '140%', height: '600px'}}
                latitude={viewport.latitude}
                longitude={viewport.longitude}
                zoom={viewport.zoom}
                onViewportChange={setViewport}
                cursorStyle="pointer"
                onClick={(e) => {
                    if (isChoosingCenter) {
                        setStreetCenterCoords(e.lngLat)
                    } else {
                        if (!isDeletingMarker) {
                            setSelectedCoordsForNewStreet(prev => [ ...prev, e.lngLat ]);
                        } else {
                            isDeletingMarker = false;
                        }
                    }
                }}
            >
                {matchingCoords &&
                    <Source id="my-data" type="geojson" data={streetSourceData}>
                        <Layer
                            id="lineLayer"
                            type="line"
                            source="my-data"
                            layout={{
                                "line-join": "round", "line-cap": "round"
                            }}
                            paint={{
                                'line-color': '#03AA46', 'line-width': 8, 'line-opacity': 0.8
                            }}
                        />
                    </Source>
                }
                {selectedCoordsForNewStreet && selectedCoordsForNewStreet.map(selectedCoords => (
                    <Marker
                        longitude={selectedCoords.lng}
                        latitude={selectedCoords.lat}
                        onClick={() => {
                            isDeletingMarker = true;
                            setSelectedCoordsForNewStreet([ ...selectedCoordsForNewStreet.filter(markerCoords => {
                                return !(markerCoords.lng === selectedCoords.lng && markerCoords.lat === selectedCoords.lat);
                            }) ]);
                        }}
                    >
                        <img
                            src={"/marker.png"}
                            width={30}
                            style={{
                                backgroundColor: 'transparent'
                            }}
                        />
                    </Marker>
                ))}
                {streetCenterCoords &&
                    <Marker
                        longitude={streetCenterCoords.lng}
                        latitude={streetCenterCoords.lat}
                    >
                        <img
                            src={"/centerMarker.png"}
                            width={30}
                            style={{
                                backgroundColor: 'transparent'
                            }}
                        />
                    </Marker>
                }
            </MapGL>
            <div
                style={{
                    textAlign: "center",
                    margin: "auto",
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    style={{
                        marginBottom: "40px",
                        width: "70%",
                        height: "70px"
                    }}
                    onClick={async () => {
                        await getMatch();
                    }}
                >
                    Намалювати
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    color={isChoosingCenter ? "success" : "primary"}
                    style={{
                        marginBottom: "40px",
                        width: "70%",
                        height: "70px"
                    }}
                    onClick={() => {
                        setIsChoosingCenter(prev => !prev);
                    }}
                >
                    Обрати середину вулиці
                </Button>
                <ButtonGroup
                    variant="contained"
                    style={{
                        width: "80%"
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setCoords(matchingCoords.coordinates);
                            setCenterCoords(streetCenterCoords);
                        }}
                    >
                        Зберігти координати
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setSelectedCoordsForNewStreet([]);
                            setMatchingCoords();
                            setStreetCenterCoords();
                        }}
                    >
                        Видалити маркери
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default Map;