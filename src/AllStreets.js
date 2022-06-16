import React, { useContext, useEffect, useState } from 'react';
import { Container, IconButton, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { StreetContext } from "./App";
import { useNavigate } from "react-router-dom";

export const AllStreets = () => {
    const {setStreet, allStreets, setAllStreets} = useContext(StreetContext);

    const navigate = useNavigate();

    useEffect(() => {
        // if (!allStreets || allStreets.length === 0) {
        async function getAllStreets() {
            const query = await fetch(process.env.REACT_APP_GATEWAY_URL + "/all-streets", {method: 'GET'});
            const response = await query.json();
            setAllStreets(response.Items);
        }

        getAllStreets();
        // }
    }, [])

    return (
        <Container maxWidth="md">
            <List>
                {allStreets && allStreets.map(street => (
                    <ListItem
                        secondaryAction={[
                            <IconButton onClick={() => {
                                setStreet(allStreets.find(streetFromArray => streetFromArray.name === street.name));
                                navigate("/edit");
                            }}>
                                <EditIcon/>
                            </IconButton>,
                            <IconButton edge="end">
                                <DeleteIcon onClick={async () => {
                                    fetch(process.env.REACT_APP_GATEWAY_URL + "/vulytsi?streetIdToDelete=" + street.id, {method: 'DELETE'})
                                        .then((response) => {
                                            if (!response.ok) {
                                                alert("Cannot delete")
                                            } else {
                                                setAllStreets(allStreets.filter(streetFromArray => streetFromArray.id !== street.id));
                                            }
                                        });
                                }}/>
                            </IconButton>
                        ]}
                    >
                        <ListItemText
                            primary={street.name}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default AllStreets;