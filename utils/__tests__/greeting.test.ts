import { getTimeBasedGreeting } from '../greeting';

describe('getTimeBasedGreeting', () => {
  // Helper to mock Date
  const mockDate = (hour: number) => {
    const mockDateInstance = new Date(2026, 1, 7, hour, 0, 0);
    jest.useFakeTimers();
    jest.setSystemTime(mockDateInstance);
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Selamat Pagi (04:00 - 10:59)', () => {
    it('should return "Selamat Pagi" at 04:00', () => {
      mockDate(4);
      expect(getTimeBasedGreeting()).toBe('Selamat Pagi');
    });

    it('should return "Selamat Pagi" at 07:00', () => {
      mockDate(7);
      expect(getTimeBasedGreeting()).toBe('Selamat Pagi');
    });

    it('should return "Selamat Pagi" at 10:59', () => {
      mockDate(10);
      expect(getTimeBasedGreeting()).toBe('Selamat Pagi');
    });
  });

  describe('Selamat Siang (11:00 - 14:59)', () => {
    it('should return "Selamat Siang" at 11:00', () => {
      mockDate(11);
      expect(getTimeBasedGreeting()).toBe('Selamat Siang');
    });

    it('should return "Selamat Siang" at 12:00', () => {
      mockDate(12);
      expect(getTimeBasedGreeting()).toBe('Selamat Siang');
    });

    it('should return "Selamat Siang" at 14:00', () => {
      mockDate(14);
      expect(getTimeBasedGreeting()).toBe('Selamat Siang');
    });
  });

  describe('Selamat Sore (15:00 - 17:59)', () => {
    it('should return "Selamat Sore" at 15:00', () => {
      mockDate(15);
      expect(getTimeBasedGreeting()).toBe('Selamat Sore');
    });

    it('should return "Selamat Sore" at 17:00', () => {
      mockDate(17);
      expect(getTimeBasedGreeting()).toBe('Selamat Sore');
    });
  });

  describe('Selamat Malam (18:00 - 03:59)', () => {
    it('should return "Selamat Malam" at 18:00', () => {
      mockDate(18);
      expect(getTimeBasedGreeting()).toBe('Selamat Malam');
    });

    it('should return "Selamat Malam" at 22:00', () => {
      mockDate(22);
      expect(getTimeBasedGreeting()).toBe('Selamat Malam');
    });

    it('should return "Selamat Malam" at 00:00 (midnight)', () => {
      mockDate(0);
      expect(getTimeBasedGreeting()).toBe('Selamat Malam');
    });

    it('should return "Selamat Malam" at 03:00', () => {
      mockDate(3);
      expect(getTimeBasedGreeting()).toBe('Selamat Malam');
    });
  });
});
