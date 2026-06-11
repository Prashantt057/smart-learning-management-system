import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { CourseService } from '../../services/course.service';
import { CourseActions } from './course.actions';

@Injectable()
export class CourseEffects {
  private actions$ = inject(Actions);
  private courseService = inject(CourseService);
  private router = inject(Router);

  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      mergeMap((action) =>
        this.courseService.getCourses({
          search: action.search,
          category: action.category,
          level: action.level,
          availability: action.availability
        }).pipe(
          map((courses) => CourseActions.loadCoursesSuccess({ courses })),
          catchError((error) => of(CourseActions.loadCoursesFailure({ error: error.message || 'Failed to load courses' })))
        )
      )
    )
  );

  loadCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourse),
      mergeMap((action) =>
        this.courseService.getCourseById(action.id).pipe(
          map((course) => CourseActions.loadCourseSuccess({ course })),
          catchError((error) => of(CourseActions.loadCourseFailure({ error: error.message || 'Failed to load course details' })))
        )
      )
    )
  );

  createCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.createCourse),
      mergeMap((action) =>
        this.courseService.createCourse(action.course).pipe(
          map((course) => CourseActions.createCourseSuccess({ course })),
          tap(() => this.router.navigate(['/courses'])),
          catchError((error) => of(CourseActions.createCourseFailure({ error: error.message || 'Failed to create course' })))
        )
      )
    )
  );

  updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.updateCourse),
      mergeMap((action) =>
        this.courseService.updateCourse(action.id, action.course).pipe(
          map((course) => CourseActions.updateCourseSuccess({ course })),
          tap(() => this.router.navigate(['/courses'])),
          catchError((error) => of(CourseActions.updateCourseFailure({ error: error.message || 'Failed to update course' })))
        )
      )
    )
  );

  deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.deleteCourse),
      mergeMap((action) =>
        this.courseService.deleteCourse(action.id).pipe(
          map(() => CourseActions.deleteCourseSuccess({ id: action.id })),
          tap(() => this.router.navigate(['/courses'])),
          catchError((error) => of(CourseActions.deleteCourseFailure({ error: error.message || 'Failed to delete course' })))
        )
      )
    )
  );
}
