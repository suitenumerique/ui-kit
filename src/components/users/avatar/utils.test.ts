import { describe, it, expect } from 'vitest';
import { getUserInitials, getUserColor } from './utils';

describe('Avatar Utils', () => {
  describe('getUserInitials', () => {
    it('should return initials from a single name', () => {
      expect(getUserInitials('John')).toBe('J');
    });

    it('should return initials from two names', () => {
      expect(getUserInitials('John Doe')).toBe('JD');
    });

    it('should return initials from a composed name', () => {
      expect(getUserInitials('John-Doe')).toBe('JD');
    });

    it('should return initials from a composed name with underscores', () => {
      expect(getUserInitials('john_doe@example.local')).toBe('JD');
    });


    it('should return only first two initials for names with more than two words', () => {
      expect(getUserInitials('John James Doe')).toBe('JJ');
      expect(getUserInitials('John James Michael Doe')).toBe('JJ');
    });

    it('should handle empty string', () => {
      expect(getUserInitials('')).toBe('');
    });
  });

  describe('getUserColor', () => {
    it('should return a color from the predefined list', () => {
      const color = getUserColor('John');
      expect(['purple', 'blue', 'green', 'yellow', 'orange', 'red', 'brown', 'cyan', 'gold', 'olive', 'rose']).toContain(color);
    });

    it('should handle empty string', () => {
      const color = getUserColor('');
      expect(['purple', 'blue', 'green', 'yellow', 'orange', 'red', 'brown', 'cyan', 'gold', 'olive', 'rose']).toContain(color);
    });
  });
}); 
