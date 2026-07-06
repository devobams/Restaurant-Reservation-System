import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Reservation from '../models/reservation.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'reservations.json');

export async function createReservation(data) {
  const reservation = new Reservation(data);

  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = JSON.parse(fileContent);
  } catch {
    // File doesn't exist or is empty — start fresh
  }

  reservations.push(reservation);
  await fs.writeFile(DATA_PATH, JSON.stringify(reservations, null, 2), 'utf-8');

  return reservation;
}

export async function getReservations() {
  try {
    const fileContent = await fs.readFile(DATA_PATH, "utf-8");
    const reservations = JSON.parse(fileContent);

    return reservations;
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}

export function getReservationById(id) {}

export function updateReservation(id, data) {}

export async function deleteReservation(id) {
  let reservations = [];
  try {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    reservations = JSON.parse(fileContent);
  } catch {
    const error = new Error('Reservation not found');
    error.statusCode = 404;
    throw error;
  }

  const index = reservations.findIndex(reservation => reservation.reservationId === id);
  if (index === -1) {
    const error = new Error('Reservation not found');
    error.statusCode = 404;
    throw error;
  }

  reservations.splice(index, 1);
  await fs.writeFile(DATA_PATH, JSON.stringify(reservations, null, 2), 'utf-8');
  return { message: 'Reservation deleted successfully' };
}