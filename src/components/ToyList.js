import React from 'react';
import { ImageList, ImageListItem, Link, Box } from '@mui/material';

const ToyList = ({ toys = [] }) => (
    <ImageList sx={{
        marginLeft: 2,
        marginBottom: 6,
        display: 'flex',
        flexWrap: 'wrap',
    }}>
        {toys.map(toy => (
            <ImageListItem key={toy.id}>
                <Link
                    href={`https://www.wowhead.com/item=${toy.item_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ marginRight: 1 }}
                >
                    <Box
                        component="img"
                        src={toy.iconUrl}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://render.worldofwarcraft.com/eu/icons/56/inv_misc_questionmark.jpg"; }}
                        alt="Icon"
                        sx={{
                            width: '40px',
                            height: 'auto',
                            filter: toy.collected ? 'none' : 'grayscale(100%)',
                            opacity: toy.collected ? 1 : 0.2,
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

export default ToyList;

