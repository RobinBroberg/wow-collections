import {AppBar, Toolbar, Grid, Typography, Button, TextField, FormControlLabel, Switch} from '@mui/material';

import NavButton from "./Buttons/NavButton";
import {useState} from "react";
import { useNavigate } from 'react-router-dom';

function NavBar({onIsDarkMode, isDarkMode}) {

    const [characterName, setCharacterName] = useState();
    const [realm, setRealm] = useState();
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
        <AppBar position="static">
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
                        <Typography variant="h6">WoW Collections</Typography>
                    </Grid>
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
                                    onChange={(e) => setCharacterName(e.target.value)}
                                />
                                <TextField
                                    id="realm"
                                    label="Realm"
                                    value={realm}
                                    size={"small"}
                                    onChange={(e) => setRealm(e.target.value)}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color={"secondary"} disabled={!characterName || !realm } onClick={handleSaveCharacter}>Login</Button>
                            </Grid>
                            <Grid item>
                            <Typography variant="h6">{ window.localStorage.getItem("character")}</Typography>
                        </Grid>
                            <Grid item>
                                <Typography variant="h6">{ window.localStorage.getItem("realm")}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Button variant="contained" color={"secondary"} onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
