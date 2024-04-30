export function refreshWowheadTooltips() {
    // eslint-disable-next-line no-undef
    if (typeof $WowheadPower !== 'undefined' && typeof $WowheadPower.refreshLinks === 'function') {
        // eslint-disable-next-line no-undef
        $WowheadPower.refreshLinks();
    }
}
