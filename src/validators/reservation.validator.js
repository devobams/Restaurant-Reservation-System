// This will contain functions to validate reservation data
export function validateReservation(data) {
  // first thing, confirm that data is an object
  if (!(typeof data === 'object' && data !== null && !Array.isArray(data))){
    return { valid: false, message: "Data must be an object" }
  }

  // second, confirm that the data object contains all the required properties
  const requiredProperties = ["fullName", "phoneNumber", "date", "time", "numberOfGuest"];
  for (const property of requiredProperties) {
    if (!data.hasOwnProperty(property)) {
      return { valid: false, message: `Missing required property: ${property}` }
    }
  }

  // third, validate the data types and formats of each property
  if (typeof data.fullName !== 'string') {
    return { valid: false, message: "fullName must be a string" }
  }

  // validate phoneNumber to be a valid Nigerian phone number
  const phoneRegex = /^(?:\+234|0)\d{10}$/;
  if (!phoneRegex.test(data.phoneNumber)) {
    return { valid: false, message: "phoneNumber must be a valid Nigerian phone number" }
  }

  // validate numberOfGuest to be a number between 1 and 10
  if (typeof data.numberOfGuest !== 'number' || data.numberOfGuest < 1 || data.numberOfGuest > 50) {
    return { valid: false, message: "numberOfGuest must be a number between 1 and 50" }
  }

  // Validate that the time is in the 24-hour format (HH:MM) e.g. 09:15, 14:30, 23:59
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(data.time)) {
    return { valid: false, message: "time must be a valid time in the format HH:MM" }
  }

  // Validate that the date follows the format (YYYY-MM-DD) and represents a real calendar date.
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date) || isNaN(new Date(data.date).getTime())) {
    return { valid: false, message: "date must be a valid date in the format YYYY-MM-DD" };
  }

  // Compare the reservation date with today's date.
   const reservationDate = new Date (data.date); 
   const today = new Date();

   //Resets both dates to midnight so only the date is compared, ignoring the current time of the day.
   reservationDate.setHours(0, 0, 0, 0);
   today.setHours(0, 0, 0, 0);

   // Reject reservation for dates that have already passed
   if (reservationDate < today){
    return {
      valid: false,
      message: "Reservation date cannot be in the past."
    };
   }

   // If the reservation is for today, reject times that have already passed.
   if (reservationDate.getTime() === today.getTime()) {
    const now = new Date();

    const [hours, minutes] = data.time.split(":").map(Number);

    const reservationDateTime = new Date(reservationDate);
    reservationDateTime.setHours(hours, minutes, 0, 0);

    if (reservationDateTime < now) {
        return {
            valid: false,
            message: "Reservation time cannot be in the past."
        };
    }
}

  // return this if all validation checks pass
  return { valid: true, message: "Validation successful" };
}

/**
 * First Question: What are we validating?
 * Answer: We are validating the reservation payload that the user provides to us
 * So this means that we are actually expecting the user to send us a replica of our reservation class.
 * That is, the data sent by the user, must contain: fullName, phoneNumber, date, time, numberOfGuest
 * However, the fullName is meant to be a string,
 * The phonenumber is meant to be a valid phonenumber in one of the accepted format: +2348012345678 or 08012345678
 * The date is meant to be a valid date in form of: YYYY-MM-DD
 * The time is meant to be a valid time in form of: HH:MM
 * The numberOfGuest is meant to be a number between 1 and 50
 * 
 * Second Question: How do we validate the data?
 * Answer: We will use regex to validate the data. We will also use the Date object to validate the date and time.
 * 
 * Third Question: What do we do if the data is invalid?
 * Answer: We will return a validation result containing an error message that explains what is wrong with the data.
 * 
 * Fourth Question: Where will the data come from to validate?
 * Answer: This will be the argument we to pass to the validate function, in this case the data argument above.
 * So this means in expectation the data argument above must be an object and we access its property with dot notation.
 */

// when you try to use this on the controller:
// const payload = req.body;
// // then you call validator on the payload
// if (validateReservation(payload).valid === false) {
//   return res.status(400).json({ error: validateReservation(payload).message });
// }

// for testing import reservationclass
// import Reservation from "../models/reservation.model.js";

// const sampleReservation = new Reservation({
//     fullName: "John Doe",
//     phoneNumber: "08157511710",
//     date: "2026-07-15",
//     time: "19:00",
//     numberOfGuest: 4,
//     status: "pending"
// });

// const result = validateReservation(sampleReservation)
// console.log(result);