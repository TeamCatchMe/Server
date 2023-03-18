import dayjs from 'dayjs';

export class DateUtil {
  static toFullString(date: Date): string {
    return dayjs(date).format('yyyyMMddHHmmss').toString();
  }
}
