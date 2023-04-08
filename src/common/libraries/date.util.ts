import dayjs from 'dayjs';
export class DateUtil {
  static isValidDate(date: string): boolean {
    if (!/^\d{4}\d{1,2}\d{1,2}$/.test(date)) return false;
    if (!dayjs(date).isValid) return false;
    return true;
  }

  static toDate(date: string): Date {
    if (!this.isValidDate(date)) return null;
    return dayjs(date, 'YYYYMMDD').add(9, 'h').toDate();
  }

  static toString(date: Date): string {
    return dayjs(date).format('YYYYMMDDHHmmss').toString();
  }
}
