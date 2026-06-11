import { FormControl, FormGroup } from '@angular/forms';
import { durationFormatValidator, noSelfPrerequisiteValidator } from './course.validators';

describe('Course Validators', () => {
  describe('durationFormatValidator', () => {
    const validator = durationFormatValidator();

    it('should validate empty or null values as null (valid)', () => {
      expect(validator(new FormControl(''))).toBeNull();
      expect(validator(new FormControl(null))).toBeNull();
    });

    it('should pass correct patterns', () => {
      expect(validator(new FormControl('6 Weeks'))).toBeNull();
      expect(validator(new FormControl('8 Months'))).toBeNull();
      expect(validator(new FormControl('12 Days'))).toBeNull();
      expect(validator(new FormControl('2 Weeks'))).toBeNull();
    });

    it('should fail incorrect patterns', () => {
      expect(validator(new FormControl('invalid'))).toEqual({ invalidDurationPattern: { value: 'invalid' } });
      expect(validator(new FormControl('6weeks'))).toEqual({ invalidDurationPattern: { value: '6weeks' } });
      expect(validator(new FormControl('Weeks 6'))).toEqual({ invalidDurationPattern: { value: 'Weeks 6' } });
      expect(validator(new FormControl('6'))).toEqual({ invalidDurationPattern: { value: '6' } });
    });
  });

  describe('noSelfPrerequisiteValidator', () => {
    it('should fail if prerequisite matches the title of the course', () => {
      const form = new FormGroup({
        title: new FormControl('Angular Architectures'),
        prereq: new FormControl('Angular Architectures', [], [/* no async */])
      });

      const validator = noSelfPrerequisiteValidator('title');
      
      // Attach validator dynamically or call it directly
      const control = form.get('prereq')!;
      expect(validator(control)).toEqual({ selfPrerequisite: true });
    });

    it('should pass if prerequisite does not match the title of the course', () => {
      const form = new FormGroup({
        title: new FormControl('Angular Architectures'),
        prereq: new FormControl('Intro to TypeScript')
      });

      const validator = noSelfPrerequisiteValidator('title');
      const control = form.get('prereq')!;
      expect(validator(control)).toBeNull();
    });
  });
});
