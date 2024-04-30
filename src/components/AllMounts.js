import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IGNORE_MOUNT_ID from "../data/mountData/mountData";

function AllMounts() {
    const [mounts, setMounts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/mounts')
        .then(response => {
            if (response.status === 200 && response.data) {
                const filteredMounts = response.data.mounts.filter(mount => !IGNORE_MOUNT_ID.includes(mount.id));
                setMounts(filteredMounts);
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
                    <li key={mount.id}>{mount.name + " " + mount.id}</li>
                ))}
            </ul>
        </div>
    );
}

export default AllMounts;


