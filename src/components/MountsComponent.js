import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MountsComponent() {
    const [mounts, setMounts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/')
        .then(response => {
            if (response.status === 200 && response.data) {
                setMounts(response.data.mounts);
            } else {
                throw new Error('Failed to fetch mounts');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setError('Failed to load mounts: ' + error.message);
        });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Mounts</h1>
            <ul>
                {mounts.map(mount => (
                    <li key={mount.id}>{mount.name}</li>  // Displaying each mount's name
                ))}
            </ul>
        </div>
    );
}

export default MountsComponent;


