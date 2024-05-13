import React, { useState, useEffect } from 'react';
import { generateCharacterAvatarLink } from "../utils/utils";

function CharacterAvatar({ characterName, realm }) {
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        async function fetchAvatarUrl() {
            if (characterName && realm) {
                try {
                    const url = await generateCharacterAvatarLink(characterName, realm);
                    setAvatarUrl(url);
                } catch (err) {
                    console.error('Failed to load character avatar:', err);
                    setAvatarUrl('');
                }
            } else {
                setAvatarUrl('');
            }
        }

        fetchAvatarUrl();
    }, [characterName, realm]);

    return avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" style={{ width: "45px", height: "auto", margin: "0px" }} />
    ) : null;
}

export default CharacterAvatar;


