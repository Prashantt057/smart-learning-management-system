import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Course } from '../../models/course.model';
import { CourseActions } from './course.actions';

export interface CourseState extends EntityState<Course> {
  loading: boolean;
  error: string | null;
  selectedCourseId: string | null;
  filters: {
    search: string;
    category: string;
    level: string;
    availability: string;
  };
}

export const adapter: EntityAdapter<Course> = createEntityAdapter<Course>({
  selectId: (course: Course) => course.id
});

export const initialCourseState: CourseState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedCourseId: null,
  filters: {
    search: '',
    category: '',
    level: '',
    availability: ''
  }
});

export const courseReducer = createReducer(
  initialCourseState,

  // Load list
  on(CourseActions.loadCourses, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CourseActions.loadCoursesSuccess, (state, { courses }) => 
    adapter.setAll(courses, { ...state, loading: false, error: null })
  ),
  on(CourseActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load single
  on(CourseActions.loadCourse, (state, { id }) => ({
    ...state,
    loading: true,
    selectedCourseId: id,
    error: null
  })),
  on(CourseActions.loadCourseSuccess, (state, { course }) => 
    adapter.upsertOne(course, { ...state, loading: false, error: null })
  ),
  on(CourseActions.loadCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create
  on(CourseActions.createCourse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CourseActions.createCourseSuccess, (state, { course }) => 
    adapter.addOne(course, { ...state, loading: false, error: null })
  ),
  on(CourseActions.createCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update
  on(CourseActions.updateCourse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CourseActions.updateCourseSuccess, (state, { course }) => 
    adapter.updateOne({ id: course.id, changes: course }, { ...state, loading: false, error: null })
  ),
  on(CourseActions.updateCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete
  on(CourseActions.deleteCourse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CourseActions.deleteCourseSuccess, (state, { id }) => 
    adapter.removeOne(id, { ...state, loading: false, error: null })
  ),
  on(CourseActions.deleteCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filters
  on(CourseActions.setFilters, (state, { search, category, level, availability }) => ({
    ...state,
    filters: { search, category, level, availability }
  })),
  on(CourseActions.clearFilters, (state) => ({
    ...state,
    filters: { search: '', category: '', level: '', availability: '' }
  }))
);

// Export entity selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
