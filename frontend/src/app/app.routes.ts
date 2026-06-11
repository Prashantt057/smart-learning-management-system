import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { EnrollmentComponent } from './pages/student/enrollment/enrollment';

import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ProfileComponent } from './features/auth/profile/profile';
import { PreferencesComponent } from './features/auth/preferences/preferences';
import { EditProfileComponent } from './features/auth/edit-profile/edit-profile';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';

import { ProgressTracker } from './features/progress/progress-tracker/progress-tracker';
import { ProgressDetails } from './features/progress/progress-details/progress-details';

import { Assessment } from './features/assessment/assessment/assessment';
import { AssessmentResult } from './features/assessment/assessment-result/assessment-result';

import { Reports } from './features/reports/reports/reports';


export const routes: Routes = [
 {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },
   {
    path: 'profile',
    component: ProfileComponent
  },
   {
    path: 'preferences',
    component: PreferencesComponent
  },
   {
    path: 'edit-profile',
    component: EditProfileComponent
  },
   {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  
  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  {
    path: 'courses',
    component: DashboardComponent,
  },

  {
    path: 'enrollment',
    component: EnrollmentComponent,
  },

  {
    path: 'progress',
    component: DashboardComponent,
  },

  {
    path: 'certificates',
    component: DashboardComponent,
  },

  {
    path: 'reports',
    component: DashboardComponent,
  },

  {
    path: 'admin',
    component: AdminDashboardComponent,
  },


  { path: 'courses', component: DashboardComponent },
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