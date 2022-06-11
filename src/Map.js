import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapGL, { Layer, Marker, Source } from "@urbica/react-map-gl";
import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from "@mui/material";

let isDeletingMarker = false;

export const Map = ({coords, setCoords, centerCoords, setCenterCoords, type, setType}) => {
    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    const [ selectedCoordsForNewStreet, setSelectedCoordsForNewStreet ] = useState([]);
    const [ matchingCoords, setMatchingCoords ] = useState();
    const [ areaCoords, setAreaCoords ] = useState();
    const [ isChoosingCenter, setIsChoosingCenter ] = useState(false);
    const [ streetCenterCoords, setStreetCenterCoords ] = useState();

    const [ viewport, setViewport ] = useState({
        latitude: 50.45056,
        longitude: 30.52428,
        zoom: 12
    });

    useEffect(() => {
        if (coords) {
            if (!type) {
                setType("STREET");
                setMatchingCoords({coordinates: coords, type: "LineString"});
            } else {

                if (type === "STREET") {
                    setMatchingCoords({coordinates: coords, type: "LineString"});
                } else if (type === "SQUARE") {
                    setAreaCoords({coordinates: coords, type: "LineString"});
                }
            }
        }
    }, [ coords, type ])

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

    const areaSourceData = {
        type: "Feature", properties: {}, geometry: areaCoords
    };

    const renderDrawButtonsForStreet = () => (
        <ButtonGroup
            variant="contained"
            style={{
                width: "80%",
                marginBottom: "40px",
            }}
        >
            <Button
                variant="contained"
                size="large"
                onClick={async () => {
                    await getMatch();
                }}
            >
                Намалювати (як маршрут)
            </Button>
            <Button
                variant="contained"
                size="large"
                onClick={() => {
                    setMatchingCoords({
                        coordinates: selectedCoordsForNewStreet.map(coords => [ coords.lng, coords.lat ]),
                        type: "LineString"
                    });
                }}
            >
                Намалювати (кастомно)
            </Button>
        </ButtonGroup>
    )

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
                {areaCoords &&
                    <Source id="my-area-data" type="geojson" data={areaSourceData}>
                        <Layer
                            id="areaLayer"
                            type="fill"
                            source="my-area-data"
                            paint={{
                                'fill-color': "#03AA46",
                                'fill-opacity': 0.8
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
                    width: "100%"
                }}
            >
                <ToggleButtonGroup
                    color="primary"
                    value={type}
                    exclusive
                    onChange={(e, newValue) => {
                        setType(newValue);
                    }}
                    style={{
                        marginBottom: "40px"
                    }}
                >
                    <ToggleButton value="STREET">Вулиця</ToggleButton>
                    <ToggleButton value="SQUARE">Площа</ToggleButton>
                </ToggleButtonGroup>

                {(type && type === "STREET") && (
                    renderDrawButtonsForStreet()
                )}
                {(type && type === "SQUARE") && (
                    <Button
                        variant="contained"
                        size="large"
                        style={{
                            marginBottom: "40px",
                            width: "80%",
                            height: "70px"
                        }}
                        onClick={() => {
                            let loopedCoords = selectedCoordsForNewStreet.map(coords => [ coords.lng, coords.lat ]);
                            loopedCoords.push(loopedCoords[0]);
                            setAreaCoords({
                                coordinates: loopedCoords,
                                type: "LineString"
                            });
                        }}
                    >
                        Замалювати
                    </Button>
                )}
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
                            if (type === "STREET") {
                                setCoords(matchingCoords.coordinates);
                            } else if (type === "SQUARE") {
                                setCoords(areaCoords.coordinates);
                            }

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
                            setAreaCoords();
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