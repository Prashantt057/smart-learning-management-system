import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CourseActions } from '../../state/course/course.actions';
import { selectFilteredCourses, selectCoursesLoading, selectCoursesError } from '../../state/course/course.selectors';
import { CategoryFilterComponent, FilterState } from '../category-filter/category-filter.component';
import { CourseCardComponent } from '../course-card/course-card.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoryFilterComponent, CourseCardComponent],
  template: `
    <div class="list-page fade-in">
      <div class="list-header">
        <div>
          <h1>Course Catalog</h1>
          <p class="subtitle">Explore high-quality modules, learn skills, and track your progress</p>
        </div>
        
        @if (authService.currentRole() === 'Admin') {
          <a routerLink="/courses/new" class="btn btn-primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Course
          </a>
        }
      </div>

      <!-- Search & Filters Panel -->
      <app-category-filter (filterChanged)="onFiltersChange($event)"></app-category-filter>

      <!-- Loading State -->
      @if (loading$ | async) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading course catalog...</p>
        </div>
      }

      <!-- Error State -->
      @if (error$ | async; as error) {
        <div class="error-container">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="error-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <p>{{ error }}</p>
          <button (click)="retryLoad()" class="btn btn-secondary btn-sm">Retry</button>
        </div>
      }

      <!-- Empty State -->
      @if (!(loading$ | async) && !(error$ | async) && (courses$ | async)?.length === 0) {
        <div class="empty-container">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="empty-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3>No Courses Found</h3>
          <p>Try modifying your search queries or category filters.</p>
        </div>
      }

      <!-- Courses Grid -->
      @if (!(loading$ | async) && !(error$ | async)) {
        <div class="grid">
          @for (course of (courses$ | async); track course.id) {
            <app-course-card 
              [course]="course" 
              (deleteRequested)="onDeleteCourse($event)"
            ></app-course-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .list-page {
      display: flex;
      flex-direction: column;
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .subtitle {
      color: #666;
      font-size: 1rem;
      margin-top: 0.25rem;
    }
    .btn-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
    .loading-container, .error-container, .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      background-color: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
    }
    .spinner {
      border: 3px solid rgba(0, 0, 0, 0.05);
      border-top: 3px solid #e07b5a;
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .error-icon, .empty-icon {
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
    }
    .error-icon {
      color: #ef4444;
    }
    .empty-icon {
      color: #888;
    }
    .empty-container h3 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
      color: #2d2424;
    }
    .empty-container p {
      color: #666;
    }
  `]
})
export class CourseListComponent implements OnInit {
  private store = inject(Store);
  authService = inject(AuthService);

  courses$ = this.store.select(selectFilteredCourses);
  loading$ = this.store.select(selectCoursesLoading);
  error$ = this.store.select(selectCoursesError);

  ngOnInit() {
    this.store.dispatch(CourseActions.loadCourses({}));
  }

  onFiltersChange(filters: FilterState) {
    this.store.dispatch(CourseActions.setFilters(filters));
  }

  onDeleteCourse(id: string) {
    this.store.dispatch(CourseActions.deleteCourse({ id }));
  }

  retryLoad() {
    this.store.dispatch(CourseActions.loadCourses({}));
  }
}
