export function calculateFine(
  dueDate: Date | string,
  returnDate: Date | string,
  ratePerDay: number = 1.0,
): number {
  const due = new Date(dueDate).getTime();
  const ret = new Date(returnDate).getTime();

  if (isNaN(due) || isNaN(ret)) {
    return 0;
  }

  if (ret <= due) {
    return 0;
  }

  const diffInMs = ret - due;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return Math.max(0, Number((diffInDays * ratePerDay).toFixed(2)));
}
