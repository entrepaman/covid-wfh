export const emptyCheck = data => {
    return (
        data !== undefined &&
        data !== "undefined" &&
        data !== "" &&
        data !== "null" &&
        data !== null
    );
};