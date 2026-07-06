import { validateReservation } from '../validators/reservation.validator.js';
import reservationService from '../services/reservation.service.js';

export async function createReservation(req, res) {
  try {
    const payload = req.body;

    const validation = validateReservation(payload);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const result = await reservationService.createReservation(payload);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    res.status(statusCode).json({ error: message });
  }
}

export async function getReservations(req, res) {
  try {
    const reservations = await reservationService.getReservations();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
}

export function getReservationById(req, res) {}

export function updateReservation(req, res) {}

export function deleteReservation(req, res) {}
