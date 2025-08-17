export const textFormate = (str) => {
    const transformedString = str
        ?.replace(/_/g, ' ')
        ?.replace(/\b\w/g, match => match.toUpperCase());

    return transformedString
}