import dayjs from 'dayjs';

export class DateUtil {
  static isValidDate(date: string): boolean {
    if (dayjs(date).isValid()) return true;
    return false;
  }

  static toDate(date: string): Date {
    if (this.isValidDate(date)) return null;
    return dayjs(date, 'YYYYMMDD').add(9, 'h').toDate();
  }

  static toString(date: Date): string {
    return dayjs(date).format('YYYYMMDDHHmmss').toString();
  }
}
