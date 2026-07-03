import reservationService from '../services/reservation.service.js';

export async function createReservation(req, res) {
  try {
    const data = req.body;
    const result = await reservationService.createReservation(data);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    res.status(statusCode).json({ error: message });
  }
}

export function getReservations(req, res) {}

export function getReservationById(req, res) {}

export function updateReservation(req, res) {}

export function deleteReservation(req, res) {}
