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

export async function getReservationById(req, res) {
  const { id } = req.params;
  const reservation = await reservationService.getReservationById(id);
  res.status(200).json(reservation);
}

export async function updateReservation(req, res) {
  // steps to implement logic
  // 1. Get the reservation id from the request params
  const { id } = req.params;
  // 2. Get the data from the request body 
  const reservationData = req.body;
  const validate = validateReservation(reservationData);
  // 3. Validate the incoming payload
  if (!validate.valid) {
    throw new AppError(validate.message, 400);
  }
  // 4. Call the service function to update the reservation
  const updatedReservation = await reservationService.updateReservation(id, reservationData);
  // 5. Return the updated reservation in the response
  res.status(200).json(updatedReservation);
}

export async function deleteReservation(req, res) {
  const { id } = req.params;
  const result = await reservationService.deleteReservation(id);
  res.status(200).json(result);
}