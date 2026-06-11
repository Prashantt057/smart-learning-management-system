import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CourseActions } from '../../state/course/course.actions';
import { selectSelectedCourse, selectCoursesLoading, selectCoursesError } from '../../state/course/course.selectors';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="details-page fade-in">
      <div class="navigation-bar">
        <a routerLink="/courses" class="btn-back">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-arrow"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Catalog
        </a>
      </div>

      <!-- Loading State -->
      @if (loading$ | async) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading course details...</p>
        </div>
      }

      <!-- Error State -->
      @if (error$ | async; as error) {
        <div class="error-container">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="error-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <p>{{ error }}</p>
          <a routerLink="/courses" class="btn btn-secondary btn-sm">Back to Catalog</a>
        </div>
      }

      <!-- Course Details View -->
      @if (!(loading$ | async) && !(error$ | async); as course) {
        @if (course$ | async; as c) {
          <div class="details-grid">
            <!-- Left Info Panel -->
            <div class="info-panel">
              <div class="image-box">
                <img [src]="c.imageUrl || fallbackImage" [alt]="c.title"/>
                <div class="floating-badges">
                  <span class="badge" [ngClass]="'badge-' + c.level.toLowerCase()">{{ c.level }}</span>
                  <span class="badge" [ngClass]="'badge-' + c.availability.toLowerCase()">{{ c.availability }}</span>
                </div>
              </div>
              
              <div class="meta-box card">
                <h3>Course Details</h3>
                <ul class="meta-list">
                  <li>
                    <span class="meta-label">Instructor</span>
                    <span class="meta-value font-semibold">{{ c.instructor }}</span>
                  </li>
                  <li>
                    <span class="meta-label">Category</span>
                    <span class="meta-value">{{ c.category }}</span>
                  </li>
                  <li>
                    <span class="meta-label">Duration</span>
                    <span class="meta-value">{{ c.duration }}</span>
                  </li>
                  <li>
                    <span class="meta-label">Completion</span>
                    <span class="meta-value badge-status" [ngClass]="'status-' + c.completionStatus.toLowerCase().replace(' ', '-')">{{ c.completionStatus }}</span>
                  </li>
                </ul>

                @if (authService.currentRole() === 'Admin') {
                  <div class="admin-panel">
                    <a [routerLink]="['/courses/edit', c.id]" class="btn btn-primary w-full">Edit Course</a>
                    <button (click)="onDeleteCourse(c.id, c.title)" class="btn btn-danger w-full">Delete Course</button>
                  </div>
                }
              </div>
            </div>

            <!-- Right Main Content Panel -->
            <div class="content-panel">
              <h1 class="title">{{ c.title }}</h1>
              <p class="description">{{ c.description }}</p>

              <!-- Objectives Section -->
              <div class="section-card card">
                <h2>Learning Objectives</h2>
                <p class="section-desc">What you will accomplish in this program:</p>
                <ul class="objective-list">
                  @for (obj of c.objectives; track obj) {
                    <li>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="check-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {{ obj }}
                    </li>
                  } @empty {
                    <li class="empty-list-msg">No objectives defined for this course yet.</li>
                  }
                </ul>
              </div>

              <!-- Prerequisites Section -->
              <div class="section-card card">
                <h2>Prerequisites</h2>
                <p class="section-desc">Recommended skills or requirements before enrolling:</p>
                <div class="prereq-container">
                  @for (prereq of c.prerequisites; track prereq) {
                    <span class="prereq-badge">{{ prereq }}</span>
                  } @empty {
                    <span class="prereq-none">No prerequisites required! This course is open to all students.</span>
                  }
                </div>
              </div>

              <!-- Syllabus Section -->
              <div class="section-card card">
                <h2>Syllabus & Modules</h2>
                <p class="section-desc">A module-by-module breakdown of this learning path:</p>
                <div class="syllabus-timeline">
                  @for (module of c.syllabus; track module; let idx = $index) {
                    <div class="timeline-item">
                      <div class="timeline-badge">{{ idx + 1 }}</div>
                      <div class="timeline-content">
                        <h4>{{ module.split(':')[0] || 'Module ' + (idx + 1) }}</h4>
                        <p>{{ module.split(':')[1] || module }}</p>
                      </div>
                    </div>
                  } @empty {
                    <p class="empty-list-msg">Syllabus modules are currently being finalized.</p>
                  }
                </div>
              </div>

            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .details-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .navigation-bar {
      margin-bottom: 0.5rem;
    }
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-weight: 500;
      transition: var(--transition-fast);
    }
    .btn-back:hover {
      color: var(--text-primary);
    }
    .icon-arrow {
      width: 1.2rem;
      height: 1.2rem;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2.5rem;
    }
    @media (max-width: 900px) {
      .details-grid {
        grid-template-columns: 1fr;
      }
    }
    .info-panel {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .image-box {
      position: relative;
      height: 230px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--border-color);
    }
    .image-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .floating-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      right: 1rem;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }
    .meta-box {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .meta-box h3 {
      font-size: 1.15rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    .meta-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 0.9rem;
    }
    .meta-list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .meta-label {
      color: var(--text-secondary);
    }
    .meta-value {
      color: var(--text-primary);
      text-align: right;
    }
    .font-semibold {
      font-weight: 600;
    }
    .badge-status {
      font-size: 0.8rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .admin-panel {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
      border-top: 1px solid var(--border-color);
      padding-top: 1.25rem;
    }
    .w-full {
      width: 100%;
    }
    .content-panel {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .title {
      font-size: 2.2rem;
      line-height: 1.2;
    }
    .description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.7;
    }
    .section-card h2 {
      font-size: 1.35rem;
      margin-bottom: 0.25rem;
    }
    .section-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
    }
    .objective-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .objective-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.95rem;
    }
    .check-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--accent-success);
      flex-shrink: 0;
      margin-top: 0.1rem;
    }
    .prereq-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .prereq-badge {
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      color: var(--accent-secondary);
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .prereq-none {
      color: var(--text-secondary);
      font-style: italic;
      font-size: 0.95rem;
    }
    .syllabus-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      position: relative;
    }
    .syllabus-timeline::before {
      content: '';
      position: absolute;
      left: 17px;
      top: 15px;
      bottom: 15px;
      width: 2px;
      background-color: var(--border-color);
    }
    .timeline-item {
      display: flex;
      gap: 1.25rem;
      position: relative;
    }
    .timeline-badge {
      width: 36px;
      height: 36px;
      background-color: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      color: var(--accent-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
      z-index: 1;
      flex-shrink: 0;
      transition: var(--transition-fast);
    }
    .timeline-item:hover .timeline-badge {
      background-color: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
    }
    .timeline-content h4 {
      font-size: 1rem;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .timeline-content p {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      text-align: center;
    }
    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.05);
      border-top: 3px solid var(--accent-secondary);
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
    .error-icon {
      width: 3rem;
      height: 3rem;
      color: var(--accent-danger);
      margin-bottom: 1rem;
    }
    .empty-list-msg {
      color: var(--text-muted);
      font-style: italic;
      font-size: 0.9rem;
    }
  `]
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  authService = inject(AuthService);

  course$ = this.store.select(selectSelectedCourse);
  loading$ = this.store.select(selectCoursesLoading);
  error$ = this.store.select(selectCoursesError);

  fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(CourseActions.loadCourse({ id }));
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onDeleteCourse(id: string, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.store.dispatch(CourseActions.deleteCourse({ id }));
    }
  }
}
