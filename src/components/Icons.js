import React from 'react';

function MountIcon({ iconUrl, name }) {
    return (
        <div>
            <h2>{name}</h2>
            <img src={iconUrl} alt={name} />
        </div>
    );
}

export default MountIcon;
