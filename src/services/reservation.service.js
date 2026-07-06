import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Reservation from '../models/reservation.model.js';
import { validateReservation } from '../validators/reservation.validator.js';
import { AppError } from '../middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'reservations.json');

export async function createReservation(data) {
  // Instantiate the Reservation model; auto-generates reservationId, tableNumber, status, timestamps
  const reservation = new Reservation(data);
  
  // Read existing reservations from the JSON file
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = JSON.parse(fileContent);
  } catch {
    // File doesn't exist or is empty, start fresh with an empty array
  }
  
  // Append the new reservation and persist to disk
  reservations.push(reservation);
  await fs.writeFile(DATA_PATH, JSON.stringify(reservations, null, 2), 'utf-8');
  
  // Return the fully populated reservation object
  return reservation;
}


export async function getReservationById(id) {
  let reservations = [];
  // 1. Try Read the reservations.json file and parse it into an array of reservations
  try {
    // Read file database
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    // If the file has text, parse it. If it's empty, use an empty array.
    reservations = fileContent.trim() ? JSON.parse(fileContent) : [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new AppError('Reservation not found', 404);
    }
    throw err;
  }
  // 2. Find the reservation with the given id in the array
  const reservation = reservations.find(reservation => reservation.reservationId === id);
  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }
  // 3. If found, return the reservation object;
  return reservation;
}

export async function getReservations() {
  try {
    const fileContent = await fs.readFile(DATA_PATH, "utf-8");
    const reservations = fileContent.trim() ? JSON.parse(fileContent) : [];
    return reservations;
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new AppError("Reservations not found", 404);
    }
    throw err;
  }
}

export async function getReservations() {
  try {
    const fileContent = await fs.readFile(DATA_PATH, "utf-8");
    const reservations = JSON.parse(fileContent);
    return reservations;
  } catch(err){
    if(err.code==="ENOENT"){
        throw new AppError("Reservations file not found",404);
    }
    throw err;
}
}

export function getReservationById(id) {}

export function updateReservation(id, data) {}

export async function deleteReservation(id) {
  // Read existing reservations from the JSON file
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = JSON.parse(fileContent);
  } catch {
    // File is missing or unreadable — nothing to delete
    throw new AppError('Reservation not found', 404);
  }

  // Locate the reservation by its ID
  const index = reservations.findIndex(reservation => reservation.reservationId === id);
  if (index === -1) {
    throw new AppError('Reservation not found', 404);
  }

  // Remove the reservation from the array and persist to disk
  reservations.splice(index, 1);
  await fs.writeFile(DATA_PATH, JSON.stringify(reservations, null, 2), 'utf-8');

  // Return a success confirmation
  return { message: 'Reservation deleted successfully' };
}




export default {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
};

// // testing update reservation by ID
// const newData = {
//   reservationId: "res-123",
//   fullName: "Jane Doe",
//   phoneNumber: "08157511711",
//   date: "2023-07-16",
//   time: "20:00",
//   numberOfGuest: 5,
//   status: "Cancelled"
// };

// const updatedResult = await updateReservation("res-123", newData)
// console.log(updatedResult);

