import React, { useContext } from 'react';
import { AppBar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { StreetContext } from "./App";

export const Header = () => {
    const {setStreet} = useContext(StreetContext);

    return (
        <div style={{
            marginBottom: "100px"
        }}>
            <AppBar>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-evenly"
                    }}>
                    <Link to="/" style={{textDecoration: 'none'}}>
                        <Button
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Усі вулиці
                        </Button>
                    </Link>
                    <Link to="/add" style={{textDecoration: 'none'}}>
                        <Button
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Додати вулицю
                        </Button>
                    </Link>
                </div>
            </AppBar>
        </div>
    );
};

export default Header;