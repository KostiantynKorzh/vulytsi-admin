import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export const DeleteModal = ({isModelOpened, handleCloseModal, streetInfo, allStreets, setAllStreets}) => {
    return (
        <>
            {streetInfo ?
                <Dialog
                    open={isModelOpened}
                    onClose={handleCloseModal}
                >
                    <DialogTitle>
                        {"Точно бажаєте видалити " + streetInfo.name}
                    </DialogTitle>
                    <DialogContent>
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
                            fetch(process.env.REACT_APP_GATEWAY_URL + "/vulytsi?streetIdToDelete=" + streetInfo.id, {method: 'DELETE'})
                                .then((response) => {
                                    if (!response.ok) {
                                        alert("Cannot delete")
                                    } else {
                                        setAllStreets(allStreets.filter(streetFromArray => streetFromArray.id !== streetInfo.id));
                                    }
                                });

                            handleCloseModal();
                        }}>Видалити</Button>
                    </DialogActions>
                </Dialog>
                :
                <></>}
        </>
    );
};

export default DeleteModal;