
const sortAchievements = (a, b) => {
    const extractNumbers = (text) => {
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const aNumber = extractNumbers(a.name);
    const bNumber = extractNumbers(b.name);

    if (aNumber !== bNumber) {
        return aNumber - bNumber;
    }

    return a.name.localeCompare(b.name);
};


const GroupAchievementsByCategory = (achievements, categories) => {
    const grouped = {};

    categories.forEach(category => {
        grouped[category.id] = {
            id: category.id,
            name: category.name,
            subcategories: {
                General: {
                    id: 'General',
                    name: 'General',
                    achievements: []
                }
            }
        };

        category.subcategories.forEach(subcategory => {
            grouped[category.id].subcategories[subcategory.id] = {
                id: subcategory.id,
                name: subcategory.name,
                achievements: []
            };
        });
    });


    achievements.forEach(achievement => {
        const parentCategory = categories.find(cat => cat.id === achievement.category.id || cat.subcategories.some(sub => sub.id === achievement.category.id));
        const isSpecialCategory = parentCategory && (parentCategory.name === "Legacy" || parentCategory.name === "Feats of Strength");

        if (parentCategory) {
            const subcategory = parentCategory.subcategories.find(sub => sub.id === achievement.category.id);

            if (subcategory) {
                if (!isSpecialCategory || achievement.collected) {
                    grouped[parentCategory.id].subcategories[subcategory.id].achievements.push(achievement);
                }
            } else {
                if (!isSpecialCategory || achievement.collected) {
                    grouped[parentCategory.id].subcategories.General.achievements.push(achievement);
                }
            }
        }
    });
    Object.values(grouped).forEach(category => {
        Object.values(category.subcategories).forEach(subcategory => {
            subcategory.achievements.sort(sortAchievements);
        });
    });

    return grouped;
};
export default GroupAchievementsByCategory;
