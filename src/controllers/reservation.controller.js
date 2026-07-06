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
    res.status(200).json(result);
}

export async function getReservations(req, res) {
  const reservations = await reservationService.getReservations();
  res.status(200).json(reservations);
}

export function getReservationById(req, res) {}

export async function updateReservation(req, res) {
  // steps to implement logic
  // 1. Get the reservation id from the request params
  const { id } = req.params;
  // 2. Get the data from the request body 
  const reservationData = req.body;
  // validate the incoming data before updating the reservation
  const validate = validateReservation(reservationData);
  if (!validate.valid) {
    const error = new AppError(validate.message);
    error.statusCode = 400;
    throw error;
  }
  // 3. Call the service function to update the reservation
  const updatedReservation = await reservationService.updateReservation(id, reservationData);
  // 4. Return the updated reservation in the response
  res.status(200).json(updatedReservation);
}

export function deleteReservation(req, res) {}
