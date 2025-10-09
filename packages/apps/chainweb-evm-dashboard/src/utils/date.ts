export function formatDateCompact(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseYYYYMMDDToDate(dateString: string): Date | null {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(dateString)) {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return isNaN(date.getTime()) ? null : date;
}

export function getDateNDaysAgo(n: number): Date {
  const date = new Date();

  date.setUTCDate(date.getUTCDate() - n);

  return date;
}

export function getDateNMonthsAgo(n: number): Date {
  const date = new Date();

  date.setUTCMonth(date.getUTCMonth() - n);

  return date;
}
