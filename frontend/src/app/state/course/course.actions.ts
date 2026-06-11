import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Course } from '../../models/course.model';

export const CourseActions = createActionGroup({
  source: 'Course Catalog',
  events: {
    // Load courses list
    'Load Courses': props<{ search?: string; category?: string; level?: string; availability?: string }>(),
    'Load Courses Success': props<{ courses: Course[] }>(),
    'Load Courses Failure': props<{ error: string }>(),

    // Load single course details
    'Load Course': props<{ id: string }>(),
    'Load Course Success': props<{ course: Course }>(),
    'Load Course Failure': props<{ error: string }>(),

    // Create course
    'Create Course': props<{ course: Partial<Course> }>(),
    'Create Course Success': props<{ course: Course }>(),
    'Create Course Failure': props<{ error: string }>(),

    // Update course
    'Update Course': props<{ id: string; course: Partial<Course> }>(),
    'Update Course Success': props<{ course: Course }>(),
    'Update Course Failure': props<{ error: string }>(),

    // Delete course
    'Delete Course': props<{ id: string }>(),
    'Delete Course Success': props<{ id: string }>(),
    'Delete Course Failure': props<{ error: string }>(),

    // Filter selectors
    'Set Filters': props<{ search: string; category: string; level: string; availability: string }>(),
    'Clear Filters': emptyProps()
  }
});
