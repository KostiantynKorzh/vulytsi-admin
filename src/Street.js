import { Button, Checkbox, Container, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Map from "./Map";
import SaveModal from "./SaveModal";
import { StreetContext } from "./App";
import FormerNameInput from "./FormerNameInput";
import Tags from "./Tags";


const Street = () => {
    const {street, setStreet} = useContext(StreetContext);

    const [ coords, setCoords ] = useState([]);
    const [ centerCoords, setCenterCoords ] = useState();
    const [ type, setType ] = useState("STREET");
    const [ tags, setTags ] = useState({
        "Декомунізація": false,
        "Дерусифікація": false,
        "Німецька окупація": false
    });

    const [ streetFromState, setStreetFromState ] = useState({
        id: "",
        name: "",
        namedAfter: "",
        year: "",
        generalInfo: "",
        coords: [],
        formerNamesInfo: [],
        type: "STREET",
        tags: []
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
        streetFromState.tags = Object.entries(tags)
            .filter(([ key, value ]) => value === true)
            .map(([ key, value ]) => key);
        setStreetFromState({...streetFromState})
    }, [ tags ])

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
            if (street.tags) {
                let checkedTags = {}
                street.tags.forEach(tag => {
                    checkedTags = {
                        ...checkedTags,
                        [tag]: true
                    }
                });
                setTags({
                    ...tags,
                    ...checkedTags
                });
            } else {
                street.tags = [];
            }
            setStreetFromState(street);
            setCoords(street.coords);
            setCenterCoords(street.centerCoords);
            setType(street.type)
        }
    }, [ street ])

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
                <Tags
                    tags={tags}
                    setTags={setTags}
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
                    <FormerNameInput
                        formerNameInfo={info}
                        streetFromState={streetFromState}
                        setStreetFromState={setStreetFromState}
                    />
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
