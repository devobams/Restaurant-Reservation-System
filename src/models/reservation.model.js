import { generateId } from "../utils/generateId.js";
export default class Reservation{
    constructor({fullName, phoneNumber, date, time, numberOfGuest, tableNumber, status
    }){
        this.reservationId = generateId();
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.date = date;
        this.time = time;
        this.numberOfGuest = numberOfGuest;
        this.tableNumber = tableNumber; // real available table, assigned by the service
        this.status = status; // e.g. 'CONFIRMED' or 'CANCELLED', decided by the service
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
}

