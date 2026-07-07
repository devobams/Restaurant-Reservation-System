import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Reservation from '../models/reservation.model.js';
import { validateReservation } from '../validators/reservation.validator.js';
import { AppError } from '../middleware/error.middleware.js';
import { generateAvailableTable } from '../utils/generateAvailableTable.js';
import { suggestNextSlot } from '../utils/suggestNextSlot.js';
import { timeToMinutes } from '../utils/timeUtils.js';
import { TOTAL_TABLES, MEAL_DURATION_MINUTES } from '../config/app.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'reservations.json');

async function createReservation(data) {
  // 1. Validate the incoming payload
  const validation = validateReservation(data);
  if (!validation.valid) {
    throw new AppError(validation.message, 400);
  }

  // 2. Read existing reservations from the data store
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = JSON.parse(fileContent);
  } catch {
    // File doesn't exist or is empty — start fresh
  }

  // 3. Prevent duplicate CONFIRMED reservations (same customer, overlapping time window)
  const newMinutes = timeToMinutes(data.time);
  const newEndMinutes = newMinutes + MEAL_DURATION_MINUTES;
  const duplicate = reservations.find(r => {
    if (r.phoneNumber !== data.phoneNumber || r.date !== data.date || r.status !== "CONFIRMED") return false;
    const existingMinutes = timeToMinutes(r.time);
    const existingEndMinutes = existingMinutes + MEAL_DURATION_MINUTES;
    return newMinutes < existingEndMinutes && existingMinutes < newEndMinutes;
  });
  if (duplicate) {
    throw new AppError('You already have a CONFIRMED reservation within this time window', 429);
  }

  // 4. Collect CONFIRMED table numbers whose time window overlaps with this request
  const reservedTableNumbers = reservations
    .filter(r => {
      if (r.date !== data.date || r.status !== "CONFIRMED") return false;
      const existingMinutes = timeToMinutes(r.time);
      const existingEndMinutes = existingMinutes + MEAL_DURATION_MINUTES;
      return newMinutes < existingEndMinutes && existingMinutes < newEndMinutes;
    })
    .map(r => r.tableNumber);

  // 5. Instant decision — find an available table or reject
  const tableNumber = generateAvailableTable(reservedTableNumbers);
  if (!tableNumber) {
    const nextSlot = suggestNextSlot(data.date, data.time, reservations);
    const message = nextSlot
      ? `No tables available at ${data.date} ${data.time}. Next available: ${nextSlot.date} at ${nextSlot.time}`
      : `No tables available at ${data.date} ${data.time}`;
    throw new AppError(message, 409);
  }

  // 6. Create the reservation (CONFIRMED instantly, system assigns table)
  const reservation = new Reservation(data);
  reservation.tableNumber = tableNumber;
  reservation.status = 'CONFIRMED';
  reservation.updatedAt = new Date().toISOString();

  // 7. Append and persist to disk
  reservations.push(reservation);
  await fs.writeFile(DATA_PATH, JSON.stringify(reservations, null, 2), 'utf-8');

  // 8. Return the fully populated reservation
  return reservation;
}

async function getReservationById(id) {
  // 1. Read existing reservations from the data store
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = fileContent.trim() ? JSON.parse(fileContent) : [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new AppError('Reservation not found', 404);
    }
    throw err;
  }

  // 2. Find the reservation by ID
  const reservation = reservations.find(r => r.reservationId === id);
  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  // 3. Return the found reservation
  return reservation;
}

async function getReservations() {
  // 1. Read all reservations from the data store
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = fileContent.trim() ? JSON.parse(fileContent) : [];
  } catch {
    // File doesn't exist or is empty — return an empty array
  }

  // 2. Return the list (may be empty)
  return reservations;
}

async function updateReservation(id, data) {
  // 1. Validate the incoming payload
  const validate = validateReservation(data);
  if (!validate.valid) {
    throw new AppError(validate.message, 400);
  }

  // 2. Read existing reservations from the data store
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = JSON.parse(fileContent);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new AppError('Reservation not found', 404);
    }
    throw err;
  }

  // 3. Find the reservation by ID
  const index = reservations.findIndex(reservation => reservation.reservationId === id);
  if (index === -1) {
    throw new AppError('Reservation not found', 404);
  }

  // 4. Merge existing data with updates and refresh the timestamp
  reservations[index] = { ...reservations[index], ...data, reservationId: id, updatedAt: new Date().toISOString() };

  // 5. Persist the updated array to disk
  await fs.writeFile(DATA_PATH, JSON.stringify(reservations, null, 2), 'utf-8');

  // 6. Return the updated reservation
  return reservations[index];
}

async function deleteReservation(id) {
  // 1. Read existing reservations from the data store
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = JSON.parse(fileContent);
  } catch {
    // File is missing or unreadable — nothing to delete
    throw new AppError('Reservation not found', 404);
  }

  // 2. Find the reservation by ID
  const index = reservations.findIndex(reservation => reservation.reservationId === id);
  if (index === -1) {
    throw new AppError('Reservation not found', 404);
  }

  // 3. Soft delete — mark as CANCELLED and refresh the timestamp
  reservations[index].status = "CANCELLED";
  reservations[index].updatedAt = new Date().toISOString();

  // 4. Persist the updated array to disk
  await fs.writeFile(DATA_PATH, JSON.stringify(reservations, null, 2), 'utf-8');

  // 5. Return a success confirmation
  return { message: 'Reservation Canceled successfully' };
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

