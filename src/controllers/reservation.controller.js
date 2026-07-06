import { validateReservation } from '../validators/reservation.validator.js';
import reservationService from '../services/reservation.service.js';
import { AppError } from '../middleware/error.middleware.js';

 export async function createReservation(req, res) {
    const payload = req.body;

    const validation = validateReservation(payload);
    if (!validation.valid) {
      throw new AppError(validation.message, 400);
    }

    const result = await reservationService.createReservation(payload);
    res.status(201).json(result);
}

export async function getReservations(req, res) {
  const reservations = await reservationService.getReservations();
  res.status(200).json(reservations);
}

export function getReservationById(req, res) {}

export function updateReservation(req, res) {}

export function deleteReservation(req, res) {}
