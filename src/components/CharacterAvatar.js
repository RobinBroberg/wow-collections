import React, { useState, useEffect } from 'react';
import { generateCharacterAvatarLink } from "../utils/Utils";
import {Avatar, Link} from "@mui/material";

function CharacterAvatar({ characterName, realm }) {
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {

        (async () => {
            if (characterName && realm) {
                try {
                    const url = await generateCharacterAvatarLink(characterName, realm);
                    setAvatarUrl(url);
                } catch (error) {
                    console.error('Failed to load character avatar:', error);
                    setAvatarUrl('');
                }
            } else {
                setAvatarUrl('');
            }
        })();
    }, [characterName, realm]);

    return avatarUrl ? (
        <Link href={`https://worldofwarcraft.blizzard.com/en-gb/character/eu/${realm}/${characterName}`} target="_blank" rel="noopener noreferrer">
            <Avatar src={avatarUrl} alt="Avatar" sx={{ width: "50px", height: "auto", margin: "5px" }} />
        </Link>

    ) : null;
}

export default CharacterAvatar;



