import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Achievements from "./views/Achievements";
import Mounts from "./views/Mounts";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {useState} from "react";
import NavBar from "./components/NavBar";
import {darkTheme, lightTheme} from "./utils/Theme";






function App() {

    const [isDarkMode, setIsDarkMode] = useState(false);
    const theme = isDarkMode ? darkTheme : lightTheme;


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <NavBar onIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode}/>
                <Routes>
                    <Route path="/mounts" element={<Mounts/>}/>
                    <Route path="/achievements" element={<Achievements/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
