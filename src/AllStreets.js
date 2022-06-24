import React, { useContext, useEffect, useState } from 'react';
import { Container, IconButton, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { StreetContext } from "./App";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";

export const AllStreets = () => {
    const {setStreet, allStreets, setAllStreets} = useContext(StreetContext);

    const navigate = useNavigate();

    const [ streetToDelete, setStreetToDelete ] = useState();
    const [ isDeleteModalOpened, setIsDeleteModalOpened ] = useState(false);

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
                {allStreets && allStreets.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                }).map(street => (
                    <ListItem
                        secondaryAction={[
                            <IconButton onClick={() => {
                                setStreet(allStreets.find(streetFromArray => streetFromArray.name === street.name));
                                navigate("/edit");
                            }}>
                                <EditIcon/>
                            </IconButton>,
                            <IconButton edge="end">
                                <DeleteIcon onClick={() => {
                                    setIsDeleteModalOpened(true);
                                    setStreetToDelete(street);
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
            <DeleteModal
                isModelOpened={isDeleteModalOpened}
                handleCloseModal={() => {
                    setIsDeleteModalOpened(false);
                }}
                streetInfo={streetToDelete}
                allStreets={allStreets}
                setAllStreets={setAllStreets}
            />
        </Container>
    );
};

export default AllStreets;