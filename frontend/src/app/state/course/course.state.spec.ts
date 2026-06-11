import { courseReducer, initialCourseState, CourseState } from './course.reducer';
import { CourseActions } from './course.actions';
import { selectFilteredCourses } from './course.selectors';
import { Course } from '../../models/course.model';

describe('Course State Management', () => {
  const dummyCourses: Course[] = [
    {
      id: '1',
      title: 'Angular Foundations',
      category: 'Web Development',
      duration: '4 Weeks',
      level: 'Beginner',
      instructor: 'John Doe',
      completionStatus: 'Completed',
      syllabus: [],
      objectives: [],
      prerequisites: [],
      description: 'Intro to Angular',
      availability: 'Available'
    },
    {
      id: '2',
      title: 'Advanced Data Pipelines',
      category: 'Data Science',
      duration: '8 Weeks',
      level: 'Advanced',
      instructor: 'Sarah Jenkins',
      completionStatus: 'In Progress',
      syllabus: [],
      objectives: [],
      prerequisites: [],
      description: 'Scala and Spark pipelines',
      availability: 'Available'
    }
  ];

  describe('Reducer', () => {
    it('should set loading to true on loadCourses', () => {
      const action = CourseActions.loadCourses({});
      const state = courseReducer(initialCourseState, action);
      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should add courses list on loadCoursesSuccess', () => {
      const action = CourseActions.loadCoursesSuccess({ courses: dummyCourses });
      const state = courseReducer(initialCourseState, action);
      expect(state.loading).toBeFalse();
      expect(state.ids.length).toBe(2);
      expect(state.entities['1']?.title).toBe('Angular Foundations');
    });

    it('should update filter parameters on setFilters', () => {
      const action = CourseActions.setFilters({ search: 'pipelines', category: 'Data Science', level: 'Advanced', availability: '' });
      const state = courseReducer(initialCourseState, action);
      expect(state.filters.search).toBe('pipelines');
      expect(state.filters.category).toBe('Data Science');
    });
  });

  describe('Selectors', () => {
    const populatedState: CourseState = {
      ids: ['1', '2'],
      entities: {
        '1': dummyCourses[0],
        '2': dummyCourses[1]
      },
      loading: false,
      error: null,
      selectedCourseId: null,
      filters: {
        search: '',
        category: '',
        level: '',
        availability: ''
      }
    };

    it('should select all courses when no filters are set', () => {
      const filtered = selectFilteredCourses.projector(dummyCourses, populatedState.filters);
      expect(filtered.length).toBe(2);
    });

    it('should select filtered courses by search string', () => {
      const filters = { ...populatedState.filters, search: 'pipelines' };
      const filtered = selectFilteredCourses.projector(dummyCourses, filters);
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Advanced Data Pipelines');
    });

    it('should select filtered courses by category', () => {
      const filters = { ...populatedState.filters, category: 'Web Development' };
      const filtered = selectFilteredCourses.projector(dummyCourses, filters);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('1');
    });
  });
});
