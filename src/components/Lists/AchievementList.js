import React from 'react';
import { ImageList, ImageListItem, Link, Box } from '@mui/material';

const AchievementList = ({ achievements = [] }) => (
    <ImageList sx={{
        marginLeft: 3,
        marginBottom: 6,
        display: 'flex',
        flexWrap: 'wrap',
    }}>
        {achievements.map(achievement => (
            <ImageListItem key={achievement.id}>
                <Link
                    href={`https://www.wowhead.com/achievement=${achievement.id}`}
                    target="_blank"
                    rel={achievement.collected ? "who=player&;when=1273022820000" : "noopener noreferrer"}
                    sx={{marginRight: 1}}
                >
                    <Box
                        component="img"
                        src={achievement.iconUrl}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://render.worldofwarcraft.com/eu/icons/56/inv_misc_questionmark.jpg"; }}
                        alt="Icon"
                        sx={{
                            width: '40px',
                            height: 'auto',
                            filter: achievement.collected ? 'none' : 'grayscale(100%)',
                            opacity: achievement.collected ? 1 : 0.2,
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

export default AchievementList;

