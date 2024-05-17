import React from 'react';
import { ImageList, ImageListItem, Link, Box } from '@mui/material';

const MountList = ({ mounts }) => (
    <ImageList sx={{ marginBottom: 3, display: 'flex', flexWrap: 'wrap', marginTop: 0 }}>
        {mounts.map(mount => (
            <ImageListItem key={mount.id}>
                <Link
                    href={`https://www.wowhead.com/mount/${mount.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ marginRight: 1 }}
                >
                    <Box
                        component="img"
                        src={`https://render.worldofwarcraft.com/eu/npcs/zoom/creature-display-${mount.display_id}.jpg`}
                        alt="Icon"
                        sx={{
                            width: '65px',
                            height: 'auto',
                            filter: mount.collected ? 'none' : 'grayscale(100%)',
                            opacity: mount.collected ? 1 : 0.4,
                            '&:hover': {
                                filter: 'none',
                                opacity: 1,
                            },
                        }}
                    />
                </Link>
            </ImageListItem>
        ))}
    </ImageList>
);

export default MountList;
