import React, { useState } from 'react';
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const FormerNameInput = ({formerNameInfo, streetFromState, setStreetFromState}) => {
    const [ typicalName, setTypicalName ] = useState();

    return (
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
                        value={formerNameInfo.formerName}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === formerNameInfo.index);
                            streetFromState.formerNamesInfo[formerNamesInfoToUpdateIndex].formerName = e.target.value;
                            setStreetFromState({...streetFromState});
                        }}
                    />
                </div>
                <div>
                    <h3>Рік</h3>
                    <TextField
                        value={formerNameInfo.year}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === formerNameInfo.index);
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
                            streetFromState.formerNamesInfo = streetFromState.formerNamesInfo.filter(formerNamesInfo => formerNamesInfo.index !== formerNameInfo.index);
                            setStreetFromState({...streetFromState});
                        }}
                    >
                    </Button>
                </div>
            </div>
            <div>
                <div>
                    <h3>Названа на честь</h3>
                    <div style={{
                        display: "flex"
                    }}>
                        <FormControl fullWidth>
                            <InputLabel id="typical_names_label_id">Типові назви</InputLabel>
                            <Select
                                labelId="typical_names_label_id"
                                value={typicalName}
                                label="Типові назви"
                                onChange={(e) => {
                                    setTypicalName(e.target.value);
                                    const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === formerNameInfo.index);
                                    streetFromState.formerNamesInfo[formerNamesInfoToUpdateIndex].namedAfter = e.target.value;
                                    setStreetFromState({...streetFromState});
                                }}
                            >
                                <MenuItem value="">-------</MenuItem>
                                <MenuItem
                                    value={"таку назву отримували більшість нових вулиць в Києві на час будівництва, після цього їм надавалі назви у Київські міські раді народних депутатів або іншіх державних органах."}>Нова</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <TextField
                        multiline
                        fullWidth
                        rows={4}
                        value={formerNameInfo.namedAfter}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === formerNameInfo.index);
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
                        value={formerNameInfo.generalInfo}
                        onChange={(e) => {
                            const formerNamesInfoToUpdateIndex = streetFromState.formerNamesInfo.findIndex(info => info.index === formerNameInfo.index);
                            streetFromState.formerNamesInfo[formerNamesInfoToUpdateIndex].generalInfo = e.target.value;
                            setStreetFromState({...streetFromState});
                        }}
                    />
                </div>
            </div>
        </div>
    )
};

export default FormerNameInput;