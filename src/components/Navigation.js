import { AppBar, Toolbar, Grid, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container alignItems="center" justifyContent="center" spacing={4}>
                    <Grid item>
                        <Typography variant="h6">WoW Collections</Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button component={Link} variant={"contained"} to="/mounts">Mounts</Button>
                            </Grid>
                            <Grid item>
                                <Button component={Link} to="/achievements" variant={"contained"}>Achievements</Button>
                            </Grid>
                            <Grid item>
                                <Button component={Link} variant={"contained"} to="/collectedMounts">Collected Mounts</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
