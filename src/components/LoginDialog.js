import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Autocomplete
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import realmData from '../data/realmData/realmData.json';

function LoginDialog({open, onClose}) {
    const [characterName, setCharacterName] = useState('');
    const [realm, setRealm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
    const realms = realmData.realms.sort((a, b) => a.name.localeCompare(b.name));

    const handleSaveCharacter = () => {
        window.localStorage.setItem("character", characterName.toLowerCase());
        window.localStorage.setItem("realm", realm);
        onClose();
        navigate('/');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter your character name and realm to continue.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Character Name"
                    type="text"
                    fullWidth
                    value={characterName}
                    onChange={e => setCharacterName(e.target.value)}
                    sx={{
                        '& .Mui-focused.MuiAutocomplete-input': {
                            color: "black"
                        },
                    }}
                />
                <Autocomplete
                    freeSolo
                    id="realm-autocomplete"
                    options={realms}
                    getOptionLabel={(option) => option.name}
                    value={realms.find(r => r.slug === realm) || null}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                    onChange={(event, newValue) => {
                        setRealm(newValue ? newValue.slug : '');
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Realm"
                            margin="dense"
                            fullWidth
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color={"secondary"}>Cancel</Button>
                <Button onClick={handleSaveCharacter} variant="contained" color={"secondary"}
                        disabled={!characterName || !realm}>Login</Button>
            </DialogActions>
        </Dialog>
    );
}

export default LoginDialog;
