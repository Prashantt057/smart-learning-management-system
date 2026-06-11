import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card fade-in">
      <div class="card-image-wrapper">
        <img [src]="course().imageUrl || fallbackImage" [alt]="course().title" class="card-image"/>
        <div class="card-badges">
          <span class="badge" [ngClass]="'badge-' + course().level.toLowerCase()">
            {{ course().level }}
          </span>
          <span class="badge" [ngClass]="'badge-' + course().availability.toLowerCase()">
            {{ course().availability }}
          </span>
        </div>
      </div>
      
      <div class="card-content">
        <span class="course-category">{{ course().category }}</span>
        <h3 class="course-title">{{ course().title }}</h3>
        
        <p class="course-instructor">By {{ course().instructor }}</p>
        <p class="course-description">{{ course().description | slice:0:110 }}{{ course().description.length > 110 ? '...' : '' }}</p>
        
        <div class="course-meta">
          <span class="meta-item">
            <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ course().duration }}
          </span>
          <span class="meta-item status-badge" [ngClass]="'status-' + course().completionStatus.toLowerCase().replace(' ', '-')">
            {{ course().completionStatus }}
          </span>
        </div>

        <div class="card-actions">
          <a [routerLink]="['/courses', course().id]" class="btn btn-secondary btn-sm flex-1">View Syllabus</a>
          
          @if (authService.currentRole() === 'Admin') {
            <div class="admin-actions">
              <a [routerLink]="['/courses/edit', course().id]" class="btn btn-edit" title="Edit Course">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="action-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </a>
              <button (click)="onDeleteClick()" class="btn btn-delete-icon" title="Delete Course">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="action-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0 !important; /* Override standard card padding */
    }
    .card-image-wrapper {
      position: relative;
      height: 180px;
      overflow: hidden;
      border-top-left-radius: var(--radius-lg);
      border-top-right-radius: var(--radius-lg);
    }
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition-normal);
    }
    .card:hover .card-image {
      transform: scale(1.05);
    }
    .card-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }
    .card-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .course-category {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .course-title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 3.25rem;
    }
    .course-instructor {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
    }
    .course-description {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
    }
    .course-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-color);
      padding-top: 0.75rem;
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--text-secondary);
    }
    .meta-icon {
      width: 1rem;
      height: 1rem;
    }
    .status-badge {
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .status-not-started {
      background-color: rgba(100, 116, 139, 0.1);
      color: var(--text-secondary);
    }
    .status-in-progress {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--accent-warning);
    }
    .status-completed {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--accent-success);
    }
    .card-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      border-radius: var(--radius-md);
    }
    .flex-1 {
      flex: 1;
    }
    .admin-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-edit, .btn-delete-icon {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      width: 2.2rem;
      height: 2.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      transition: var(--transition-fast);
      padding: 0;
    }
    .btn-edit:hover {
      background-color: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
    }
    .btn-delete-icon:hover {
      background-color: var(--accent-danger);
      color: white;
      border-color: var(--accent-danger);
    }
    .action-icon {
      width: 1.1rem;
      height: 1.1rem;
    }
  `]
})
export class CourseCardComponent {
  course = input.required<Course>();
  deleteRequested = output<string>();

  authService = inject(AuthService);

  fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

  onDeleteClick() {
    if (confirm(`Are you sure you want to delete "${this.course().title}"?`)) {
      this.deleteRequested.emit(this.course().id);
    }
  }
}
