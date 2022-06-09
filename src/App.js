import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Street from "./Street";
import AllStreets from "./AllStreets";
import { createContext, useState } from "react";
import Header from "./Header";

export const StreetContext = createContext({
    street: null, setStreet: () => {
    },
    allStreets: [], setAllStreets: () => {
    }
});

const App = () => {
    const [ street, setStreet ] = useState();
    const [ allStreets, setAllStreets ] = useState();

    return (
        <StreetContext.Provider value={{street, setStreet, allStreets, setAllStreets}}>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<AllStreets/>}/>
                    <Route path="/add" element={<Street/>}/>
                    <Route path="/edit" element={<Street/>}/>
                </Routes>
            </BrowserRouter>
        </StreetContext.Provider>
    )
}

export default App;
