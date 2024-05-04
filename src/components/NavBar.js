import {AppBar, Toolbar, Grid, Typography, Button, TextField, FormControlLabel, Switch} from '@mui/material';

import NavButton from "./Buttons/NavButton";
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import myImage from "../data/icons/World-of-Warcraft-Logo-2004.png"

function NavBar({onIsDarkMode, isDarkMode}) {

    const [characterName, setCharacterName] = useState("");
    const [realm, setRealm] = useState("");
    const navigate = useNavigate();

    const handleSaveCharacter = () => {
        window.localStorage.setItem("character", characterName);
        window.localStorage.setItem("realm", realm);
        navigate('/mounts');
        setCharacterName('');
        setRealm('');
    }

    const handleLogout = () => {
        window.localStorage.removeItem("character");
        window.localStorage.removeItem("realm");
        setCharacterName(null)
        setRealm(null)
        navigate('/');
    }

    return (
        <AppBar position="sticky">
            <Toolbar>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isDarkMode}
                            color="primary"
                            onChange={() => onIsDarkMode(isDarkMode => !isDarkMode)}
                        />}
                    label="Dark"
                    labelPlacement="start"
                />
                <Grid container alignItems="center" justifyContent="center" spacing={4}>
                    <Grid item>
                        <img src={myImage} alt="Description"  style={{ width: "120px", height: "auto", margin: "0px" }} />

                    </Grid>
                    {/*<Grid item>*/}
                    {/*    <Typography variant="h6">Collections</Typography>*/}
                    {/*</Grid>*/}
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item>
                                <NavButton to="/achievements" label="Achievements" />
                            </Grid>
                            <Grid item>
                                <NavButton to="/mounts" label="Mounts" />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="userName"
                                    label="Username"
                                    value={characterName}
                                    size={"small"}
                                    onChange={(event) => setCharacterName(event.target.value)}
                                    style={{marginRight: "10px"}}
                                />
                                <TextField
                                    id="realm"
                                    label="Realm"
                                    value={realm}
                                    size={"small"}
                                    onChange={(event) => setRealm(event.target.value)}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color={"secondary"} disabled={!characterName || !realm } onClick={handleSaveCharacter}>Login</Button>
                            </Grid>
                            <Grid item>
                            <Typography variant="h6">{ window.localStorage.getItem("character")}</Typography>
                        </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Button variant="contained" color={"secondary"} disabled={window.localStorage.getItem("character") === null} onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
