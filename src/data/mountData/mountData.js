export const IGNORE_MOUNT_ID = [
    7, 8, 12, 13, 15, 22, 28, 35, 43, 70, 116, 121, 123, 145, 206, 222, 225, 238, 251, 273, 274,
    308, 333, 334, 335, 462, 484, 485, 776, 934, 935, 936, 1269, 1270, 1271, 1272, 1578,
    1605, 1690, 1771, 1786, 1787, 1788, 1789, 1796, 1953, 1954,
]

export const LEGACY = [
    32, 42, 45, 46, 50, 51, 52, 53, 54, 56, 62, 63, 64, 73, 74, 169, 199, 207, 241, 263, 313, 317, 342, 343, 424, 428
];


export const EXPANSIONS = [
    {name: 'Classic', range: [1, 122]},
    {name: 'The Burning Crusade', range: [125, 220]},
    {name: 'Wrath of the Lich King', range: [221, 366]},
    {name: 'Cataclysm', range: [367, 447]},
    {name: 'Pandaria', range: [448, 571]},
    {name: 'Warlords of Draenor', range: [593, 772]},
    {name: 'Legion', range: [773, 986]},
    {name: 'Battle for Azeroth', range: [987, 1329]},
    {name: 'Shadowlands', range: [1330, 1553]},
    {name: 'Dragonflight', range: [1556, Infinity]},
    {name: 'Legacy', range: LEGACY},
];


