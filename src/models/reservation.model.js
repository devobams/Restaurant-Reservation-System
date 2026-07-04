import { generateId } from "../utils/generateId.js";
import { generateTableNumber } from "../utils/generateTableNumber.js";

const status = ["PENDING", "CONFIRMED", "REJECTED"]
const randomIndex = Math.floor(Math.random() * status.length)

export default class Reservation{
    constructor({fullName, phoneNumber, date, time, numberOfGuest
    }){
        this.reservationId = generateId();
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.date = date;
        this.time = time;
        this.numberOfGuest = numberOfGuest;
        this.tableNumber = generateTableNumber(); // randomly assign a table number between 1 and 10
        this.status = status[randomIndex]; // randomly assign a status from the status array
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toDateString();
    }
}

// const sampleReservation = new Reservation({
//     fullName: "John Doe",
//     phoneNumber: "123-456-7890",
//     date: "2023-07-15",
//     time: "19:00",
//     numberOfGuest: 4,
//     status: "pending"
// });

// console.log(typeof sampleReservation === 'object' && sampleReservation !== null && !Array.isArray(sampleReservation));
// console.log(Array.isArray({})) 
// console.log(sampleReservation);