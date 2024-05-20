import {AppBar, Toolbar, Grid, Button, FormControlLabel, Box, Link} from '@mui/material';

import NavButton from "./Buttons/NavButton";
import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import siteLogo from "../data/icons/SiteLogo.png"
import CharacterAvatar from "./CharacterAvatar";
import LoginDialog from "./LoginDialog";
import {MaterialUISwitch} from "../utils/Theme";

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
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={
                                <MaterialUISwitch
                                    checked={isDarkMode}
                                    onChange={() => onIsDarkMode(isDarkMode => !isDarkMode)}
                                />
                            }
                            label=""
                        />
                    </Grid>
                    <Grid sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Grid container spacing={2} sx={{alignItems: "center"}}>
                            <Link href={"/"} sx={{ textDecoration: 'none' }} >
                                <Box component="img" src={siteLogo} alt="Logo"
                                     sx={{ width: "auto", height: "50px", marginRight: 7, marginTop: 3 }} />
                            </Link>
                            <Grid item>
                                <NavButton to="/achievements" label="Achievements" disabled={!isLoggedIn()}/>
                            </Grid>
                            <Grid item>
                                <NavButton to="/mounts" label="Mounts" disabled={!isLoggedIn()}/>
                            </Grid>
                            <Grid item>
                                <NavButton to="/toys" label="Toys" disabled={!isLoggedIn()}/>
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
