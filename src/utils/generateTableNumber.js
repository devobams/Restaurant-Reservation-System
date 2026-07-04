// Randomly pick tables between 1 and 10
export function generateTableNumber() {
    const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randomIndex = Math.floor(Math.random() * tableNumbers.length);
    return tableNumbers[randomIndex];
}