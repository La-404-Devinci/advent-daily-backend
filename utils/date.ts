export const toDateString = (date?: Date) => {
    const d = date || new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

export const toDateISOString = (date?: Date) => {
    const d = date || new Date();
    return toDateString(d) + "T00:00:00.000Z";
};
