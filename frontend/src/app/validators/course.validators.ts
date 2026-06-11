import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that the duration matches a pattern like "X Weeks", "Y Months", or "Z Days".
 */
export function durationFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Pattern: "number space Weeks/Months/Days" (case-insensitive)
    const regex = /^\d+\s+(Weeks|Months|Days|Weeks|Weeks)$/i;
    const valid = regex.test(control.value);
    return valid ? null : { invalidDurationPattern: { value: control.value } };
  };
}

/**
 * Ensures that a prerequisite title doesn't match the course title (which would cause a circular dependency).
 */
export function noSelfPrerequisiteValidator(titleControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;

    const titleControl = parent.get(titleControlName);
    if (!titleControl) return null;

    const courseTitle = titleControl.value ? titleControl.value.trim().toLowerCase() : '';
    const prereqVal = control.value;

    if (Array.isArray(prereqVal)) {
      const selfPrereq = prereqVal.some(p => p && p.trim().toLowerCase() === courseTitle);
      return selfPrereq ? { selfPrerequisite: true } : null;
    }

    if (prereqVal && prereqVal.trim().toLowerCase() === courseTitle) {
      return { selfPrerequisite: true };
    }

    return null;
  };
}
