import { TOTAL_TABLES } from '../config/app.config.js';

function suggestNextSlot(date, time, reservations) {
  const [hours, minutes] = time.split(':').map(Number);
  for (let h = hours + 1; h <= Math.min(hours + 3, 23); h++) {
    const nextTime = `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const taken = reservations.filter(
      r => r.date === date && r.time === nextTime && r.status === "CONFIRMED"
    ).length;
    if (taken < TOTAL_TABLES) {
      return { date, time: nextTime };
    }
  }
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split('T')[0];
  const taken = reservations.filter(
    r => r.date === nextDateStr && r.time === time && r.status === "CONFIRMED"
  ).length;
  if (taken < TOTAL_TABLES) {
    return { date: nextDateStr, time };
  }
  return null;
}

export { suggestNextSlot };