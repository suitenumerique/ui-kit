const AVATAR_COLORS = [
    "purple",
    "blue",
    "green",
    "yellow",
    "orange",
    "red",
    "brown",
    "cyan",
    "gold",
    "olive",
    "rose",
  ];


/**
 * Split the name into parts and return the first two initials
 */
export const getUserInitials = (name: string) => {
    // If there are more than 2 words, take only the first two ones
    return name
        .split(/[\s-_]+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

/**
 * Get a consistent avatar's color according to a hash of the name
 */
export const getUserColor = (name: string) => {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }

    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};
