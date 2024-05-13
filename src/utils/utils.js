
export function refreshWowheadTooltips() {
    // eslint-disable-next-line no-undef
    if (typeof $WowheadPower !== 'undefined' && typeof $WowheadPower.refreshLinks === 'function') {
        // eslint-disable-next-line no-undef
        $WowheadPower.refreshLinks();
    }
}

export async function generateCharacterAvatarLink(characterName, realm) {

    if (!characterName || !realm) {
        console.error('Character name and realm are required but not specified in localStorage');
        return null;
    }

    try {
        const response = await fetch(`http://localhost:5000/character?characterName=${encodeURIComponent(characterName)}&realm=${encodeURIComponent(realm)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.characterId) {
            const idMod256 = data.characterId % 256;
            return `https://render.worldofwarcraft.com/eu/character/${realm.toLowerCase()}/${idMod256}/${data.characterId}-avatar.jpg`;
        } else {
            console.error('Character not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching character ID:', error);
        return null;
    }
}
