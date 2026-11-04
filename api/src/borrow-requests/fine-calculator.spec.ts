import { calculateFine } from './fine-calculator';

describe('calculateFine Unit Tests', () => {
  it('returns 0 fine when returned on time or early', () => {
    const dueDate = new Date('2026-10-01T12:00:00Z');
    const returnDateOnTime = new Date('2026-10-01T10:00:00Z');
    const returnDateEarly = new Date('2026-09-28T12:00:00Z');

    expect(calculateFine(dueDate, returnDateOnTime, 1.5)).toBe(0);
    expect(calculateFine(dueDate, returnDateEarly, 1.5)).toBe(0);
  });

  it('calculates late fine accurately when returned late', () => {
    const dueDate = new Date('2026-10-01T12:00:00Z');
    const returnDateLate = new Date('2026-10-04T12:00:00Z'); // 3 days late

    const fine = calculateFine(dueDate, returnDateLate, 2.0); // $2.00 per day
    expect(fine).toBe(6.0);
  });
});
