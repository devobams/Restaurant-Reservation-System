import { TOTAL_TABLES } from "../config/app.config.js";

export function generateAvailableTable(reservedTableNumbers) {
    // a loop to find the first available table number that is not in the reservedTableNumbers array
    for (let table = 1; table <= TOTAL_TABLES; table++) {
        if (!reservedTableNumbers.includes(table)) {
            return table;
        }
    }
    // if all tables are reserved, return null
    return null; // our restaurant is fully booked, no available tables
}
