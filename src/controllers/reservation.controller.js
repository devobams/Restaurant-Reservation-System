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

export function getReservations(req, res) {}

export async function getReservationById(req, res) {
  try {
    const { id } = req.params;

    const reservation = await reservationService.getReservationById(id); 

    res.status(200).json(reservation);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    res.status(statusCode).json({
      error: message,
    });
  }
}

export function updateReservation(req, res) {}

export function deleteReservation(req, res) {}
