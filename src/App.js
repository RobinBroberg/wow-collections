import './App.css';
import AllMounts from "./components/AllMounts";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Achievements from "./components/Achievements";
import CollectedMounts from "./components/CollectedMounts";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import React from "react";
import Navigation from "./components/Navigation";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Navigation/>
                <Routes>
                    <Route path="/mounts" element={<AllMounts/>}/>
                    <Route path="/collectedMounts" element={<CollectedMounts/>}/>
                    <Route path="/achievements" element={<Achievements/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
