import { Button, Container, Divider, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Map from "./Map";
import SaveModal from "./SaveModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { StreetContext } from "./App";


const Street = () => {
    const {street, setStreet} = useContext(StreetContext);

    const [ coords, setCoords ] = useState([]);
    const [ centerCoords, setCenterCoords ] = useState();
    const [ type, setType ] = useState("STREET");

    const [ streetFromState, setStreetFromState ] = useState({
        id: "",
        name: "",
        namedAfter: "",
        year: "",
        generalInfo: "",
        coords: [],
        formerNamesInfo: [],
        type: "STREET"
    });

    const [ isModelOpened, setIsModelOpened ] = useState(false);

    useEffect(() => {
        return (() => {
            setStreet();
        })
    }, [])

    // useEffect(() => {
    //     console.log(streetFromState);
    // }, [ streetFromState ])

    useEffect(() => {
        if (coords) {
            streetFromState.coords = coords;
            setStreetFromState({...streetFromState});
        }
    }, [ coords ])

    useEffect(() => {
        if (centerCoords) {
            streetFromState.centerCoords = centerCoords;
            setStreetFromState({...streetFromState});
        }
    }, [ centerCoords ])

    useEffect(() => {
        if (type) {
            streetFromState.type = type;
            setStreetFromState({...streetFromState});
        }
    }, [ type ])

    useEffect(() => {
        if (street) {
            street.formerNamesInfo.map((formerNameInfo, i) => {
                formerNameInfo.index = i;
                return formerNameInfo;
            })
            setStreetFromState(street);
            setCoords(street.coords);
            setCenterCoords(street.centerCoords);
            setType(street.type)
        }
    }, [ street ])

    const renderFormerNameInput = (index, formerName, year, generalInfo, namedAfter) => (
        <div style={{marginBottom: "30px"}}>
            <Divider/>
            <div style={{display: "flex"}}>
                <div style={{
                    minWidth: "80%",
                    marginRight: "15px",
                }}>
                    <h3>Назва</h3>
                    <TextField
                        fullWidth
                        value={formerName}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === index);
                            streetFromState.formerNamesInfo[formerNamesInfoToUpdateIndex].formerName = e.target.value;
                            setStreetFromState({...streetFromState});
                        }}
                    />
                </div>
                <div>
                    <h3>Рік</h3>
                    <TextField
                        value={year}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === index);
                            streetFromState.formerNamesInfo[formerNamesInfoToUpdateIndex].year = e.target.value;
                            setStreetFromState({...streetFromState});
                        }}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon/>}
                        style={{
                            maxWidth: "30px",
                            height: "50px",
                            position: "relative",
                            top: "62px",
                            marginLeft: "15px"
                        }}
                        onClick={() => {
                            streetFromState.formerNamesInfo = streetFromState.formerNamesInfo.filter(formerNamesInfo => formerNamesInfo.index !== index);
                            setStreetFromState({...streetFromState});
                        }}
                    >
                    </Button>
                </div>
            </div>
            <div>
                <div>
                    <h3>Названа на честь</h3>
                    <TextField
                        fullWidth
                        value={namedAfter}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === index);
                            streetFromState.formerNamesInfo[formerNamesInfoToUpdateIndex].namedAfter = e.target.value;
                            setStreetFromState({...streetFromState});
                        }}
                    />
                </div>
                <div>
                    <h3>Загальна інформація</h3>
                    <TextField
                        multiline
                        fullWidth
                        rows={3}
                        value={generalInfo}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === index);
                            streetFromState.formerNamesInfo[formerNamesInfoToUpdateIndex].generalInfo = e.target.value;
                            setStreetFromState({...streetFromState});
                        }}
                    />
                </div>
            </div>
        </div>
    )

    const onClickAddFormerName = () => {
        if (!streetFromState.formerNamesInfo || streetFromState.formerNamesInfo.length === 0) {
            streetFromState.formerNamesInfo = [ ...streetFromState.formerNamesInfo, {index: 0, formerName: ""} ]
            setStreetFromState({...streetFromState});
            return;
        }
        const indexes = streetFromState.formerNamesInfo.map(info => info.index);
        const maxIndex = Math.max(...indexes);
        streetFromState.formerNamesInfo.push({index: maxIndex + 1, formerName: ""});
        setStreetFromState({...streetFromState});
    }

    return (
        <>
            <Container>
                <Map
                    coords={coords}
                    setCoords={setCoords}
                    centerCoords={centerCoords}
                    setCenterCoords={setCenterCoords}
                    type={type}
                    setType={setType}
                />
                <div style={{display: "flex",}}>
                    <div style={{
                        minWidth: "80%",
                        marginRight: "15px"
                    }}>
                        <h1>Назва</h1>
                        <TextField
                            fullWidth
                            value={streetFromState.name}
                            onChange={(e) => {
                                streetFromState.name = e.target.value;
                                setStreetFromState({...streetFromState});
                            }}
                        />
                    </div>
                    <div>
                        <h1>Рік</h1>
                        <TextField
                            fullWidth
                            value={streetFromState.year}
                            onChange={(e) => {
                                streetFromState.year = e.target.value;
                                setStreetFromState({...streetFromState});
                            }}
                        />
                    </div>
                </div>
                <h1>Названа на честь</h1>
                <TextField
                    multiline
                    fullWidth
                    rows={4}
                    value={streetFromState.namedAfter}
                    onChange={(e) => {
                        streetFromState.namedAfter = e.target.value;
                        setStreetFromState({...streetFromState});
                    }}
                />
                <h1>Загальна інформація</h1>
                <TextField
                    multiline
                    fullWidth
                    rows={5}
                    value={streetFromState.generalInfo}
                    onChange={(e) => {
                        streetFromState.generalInfo = e.target.value;
                        setStreetFromState({...streetFromState});
                    }}
                />
                <div
                    style={{
                        display: "flex"
                    }}
                >
                    <h1>Колишні назви</h1>
                    <Button
                        variant="contained"
                        style={{
                            height: "50px",
                            width: "150px",
                            margin: "auto 70px"
                        }}
                        onClick={() => onClickAddFormerName()}
                    >
                        Додати
                    </Button>
                </div>
                {streetFromState.formerNamesInfo && streetFromState.formerNamesInfo.map(info => (
                    renderFormerNameInput(info.index, info.formerName, info.year, info.generalInfo, info.namedAfter)
                ))}
                <Button
                    variant="contained"
                    onClick={() => {
                        setIsModelOpened(true);
                    }}
                >
                    Зберігти
                </Button>
            </Container>
            <SaveModal
                isModelOpened={isModelOpened}
                handleCloseModal={() => {
                    setIsModelOpened(false);
                }}
                streetInfo={streetFromState}/>
        </>
    );
}

export default Street;
