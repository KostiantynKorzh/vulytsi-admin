import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const SaveModal = ({isModelOpened, handleCloseModal, streetInfo}) => {
    const navigate = useNavigate();

    const validateStreetInfo = async () => {
        if (streetInfo) {
            if (!streetInfo.coords || streetInfo.coords.length === 0) {
                alert("Додайте координати вулиці");
                handleCloseModal();
                return;
            }
            if (!streetInfo.centerCoords) {
                alert("Додайте координати середини");
                handleCloseModal();
                return;
            }
            if (!streetInfo.name || streetInfo.name.length === 0) {
                alert("Додайте назву вулиці");
                handleCloseModal();
                return;
            }
            await fetch(process.env.REACT_APP_GATEWAY_URL + "/vulytsi", {
                method: 'POST',
                body: JSON.stringify(streetInfo),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            handleCloseModal();
            navigate("/");
        }
    }

    return (
        <Dialog
            open={isModelOpened}
            onClose={handleCloseModal}
        >
            <DialogTitle>
                {"Перевірка"}
            </DialogTitle>
            <DialogContent>
                <h2>Теги</h2>
                <ul>{streetInfo.tags.map(tag=>(
                    <li>{tag}</li>
                ))}</ul>
                <h2>Назва</h2>
                <p>{streetInfo.name}</p>
                <h2>Рік</h2>
                <p>{streetInfo.year}</p>
                <h2>Загальна інформація</h2>
                <p>{streetInfo.generalInfo}</p>
                <h2>Колишні назви</h2>
                {streetInfo.formerNamesInfo && streetInfo.formerNamesInfo.map(info => (
                    <p>{info.formerName} : {info.year}</p>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Відміна</Button>
                <Button onClick={async () => {
                    await validateStreetInfo();
                }}>Зберігти</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SaveModal;