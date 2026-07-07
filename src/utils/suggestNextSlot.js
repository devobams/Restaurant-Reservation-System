import { TOTAL_TABLES, MEAL_DURATION_MINUTES } from '../config/app.config.js';
import { timeToMinutes } from './timeUtils.js';

function countTakenTables(date, time, reservations) {
  const minutes = timeToMinutes(time);
  const endMinutes = minutes + MEAL_DURATION_MINUTES;
  return reservations.filter(r => {
    if (r.date !== date || r.status !== "CONFIRMED") return false;
    const existingMinutes = timeToMinutes(r.time);
    const existingEndMinutes = existingMinutes + MEAL_DURATION_MINUTES;
    return minutes < existingEndMinutes && existingMinutes < endMinutes;
  }).length;
}

function suggestNextSlot(date, time, reservations) {
  const [hours, minutes] = time.split(':').map(Number);
  for (let h = hours + 1; h <= Math.min(hours + 3, 23); h++) {
    const nextTime = `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    if (countTakenTables(date, nextTime, reservations) < TOTAL_TABLES) {
      return { date, time: nextTime };
    }
  }
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split('T')[0];
  if (countTakenTables(nextDateStr, time, reservations) < TOTAL_TABLES) {
    return { date: nextDateStr, time };
  }
  return null;
}

export { suggestNextSlot };