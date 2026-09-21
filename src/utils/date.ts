import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export type DateInput = string | Date | null | undefined;

/**
 * Format a date string or Date object into a readable date (e.g. 11 Sep 2026).
 */
export const formatDate = (date: DateInput, formatStr = 'DD MMM YYYY'): string => {
  if (!date) return '-';
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(formatStr) : '-';
};

/**
 * Format a date string or Date object with time (e.g. 11 Sep 2026 15:30).
 */
export const formatDateTime = (date: DateInput): string => {
  if (!date) return '-';
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('DD MMM YYYY HH:mm') : '-';
};

/**
 * Format full date for formal documents and contracts (e.g. 11 September 2026).
 */
export const formatDateFull = (date: DateInput): string => {
  if (!date) return '-';
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('DD MMMM YYYY') : '-';
};

/**
 * Format a date range with separator (e.g. 01 Jan 2026 s/d 31 Des 2026).
 */
export const formatDateRange = (
  startDate: DateInput,
  endDate: DateInput
): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start === '-' && end === '-') return '-';
  return `${start} s/d ${end}`;
};

export default dayjs;
