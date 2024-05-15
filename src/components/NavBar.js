import {AppBar, Toolbar, Grid, Button, FormControlLabel, Switch, Typography, Box} from '@mui/material';

import NavButton from "./Buttons/NavButton";
import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import wowLogo from "../data/icons/World-of-Warcraft-Logo-2004.png"
import CharacterAvatar from "./CharacterAvatar";
import LoginDialog from "./LoginDialog";

function NavBar({onIsDarkMode, isDarkMode}) {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [characterName, setCharacterName] = useState(localStorage.getItem('character'));
    const [realm, setRealm] = useState(localStorage.getItem('realm'));
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        setCharacterName(localStorage.getItem('character'));
        setRealm(localStorage.getItem('realm'));
        navigate('/mounts');
    };

    const handleLogout = () => {
        window.localStorage.removeItem("character");
        window.localStorage.removeItem("realm");
        setCharacterName(null);
        setRealm(null);
        navigate('/');
    };

    const isLoggedIn = () => window.localStorage.getItem("character") && window.localStorage.getItem("realm");

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Grid container sx={{alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isDarkMode}
                                    color="primary"
                                    onChange={() => onIsDarkMode(isDarkMode => !isDarkMode)}
                                />
                            }
                            label="Dark"
                            labelPlacement="start"
                        />
                    </Grid>

                    <Grid item sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Grid container spacing={2} sx={{alignItems: "center", justifyContent: "center"}}>
                            <Grid item>
                                <Box component="img" src={wowLogo} alt="Logo" sx={{width: "120px", height: "auto"}}/>
                            </Grid>
                            <Grid item>
                                <NavButton to="/achievements" label="Achievements" disabled={!isLoggedIn()}/>
                            </Grid>
                            <Grid item>
                                <NavButton to="/mounts" label="Mounts" disabled={!isLoggedIn()}/>
                            </Grid>
                            <Grid item>
                                <NavButton to="/pets" label="Pets" disabled={!isLoggedIn()}/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                        <Grid item sx={{marginRight: "5px", display: "flex"}}>
                            <CharacterAvatar characterName={characterName} realm={realm}/>
                        </Grid>
                        <Grid item>
                            {!isLoggedIn() ? (
                                <Button variant="contained" color={"secondary"} onClick={handleLoginClick}>
                                    Login
                                </Button>
                            ) : (
                                <Button variant="contained" color={"secondary"} onClick={handleLogout}>
                                    Logout
                                </Button>
                            )}
                            <LoginDialog open={dialogOpen} onClose={handleClose}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>

    );
}

export default NavBar;
