/**
 * Time-based Indonesian greeting utility
 *
 * Returns appropriate greeting based on current time:
 * - 04:00 - 10:59: Selamat Pagi (Good Morning)
 * - 11:00 - 14:59: Selamat Siang (Good Afternoon)
 * - 15:00 - 17:59: Selamat Sore (Good Evening)
 * - 18:00 - 03:59: Selamat Malam (Good Night)
 */

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 11) {
    return 'Selamat Pagi';
  } else if (hour >= 11 && hour < 15) {
    return 'Selamat Siang';
  } else if (hour >= 15 && hour < 18) {
    return 'Selamat Sore';
  } else {
    // 18:00 - 03:59
    return 'Selamat Malam';
  }
}
