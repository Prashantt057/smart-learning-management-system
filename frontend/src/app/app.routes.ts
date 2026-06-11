import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { EnrollmentComponent } from './pages/student/enrollment/enrollment';

import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';

import { ProgressTracker } from './features/progress/progress-tracker/progress-tracker';
import { ProgressDetails } from './features/progress/progress-details/progress-details';

import { Assessment } from './features/assessment/assessment/assessment';
import { AssessmentResult } from './features/assessment/assessment-result/assessment-result';

import { Reports } from './features/reports/reports/reports';

// NEW
import { CourseListComponent } from './components/course-list/course-list.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },

  // Course Management Module
  { path: 'courses', component: CourseListComponent },

  // Enrollment Module
  { path: 'enrollment', component: EnrollmentComponent },

  // Progress Module
  { path: 'progress', component: ProgressTracker },
  { path: 'progress/:id', component: ProgressDetails },

  // Assessment Module
  { path: 'assessment/:id', component: Assessment },
  { path: 'assessment-result/:id', component: AssessmentResult },

  // Placeholder until certificates module arrives
  { path: 'certificates', component: DashboardComponent },

  // Reports Module
  { path: 'reports', component: Reports },

  // Admin
  { path: 'admin', component: AdminDashboardComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];