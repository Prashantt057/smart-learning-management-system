import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { EnrollmentService } from '../../../services/enrollment';
import { CourseService } from '../../../services/course';
import { CategoryService } from '../../../services/category';
import { InstructorService } from '../../../services/instructor';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './enrollment.html',
  styleUrl: './enrollment.css'
})
export class EnrollmentComponent implements OnInit {

  enrollments: any[] = [];
  courses: any[] = [];
  categories: any[] = [];
  instructors: any[] = [];

  constructor(
    private enrollmentService: EnrollmentService,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private instructorService: InstructorService,
    private cdr: ChangeDetectorRef  // ✅ added
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
    this.loadCourses();
    this.loadCategories();
    this.loadInstructors();
  }

  loadEnrollments(): void {
    this.enrollmentService.getEnrollments().subscribe({
      next: (data) => {
        this.enrollments = [...data];  // ✅ spread
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = [...data];  // ✅ spread
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = [...data];  // ✅ spread
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); }
    });
  }

  loadInstructors(): void {
    this.instructorService.getInstructors().subscribe({
      next: (data) => {
        this.instructors = [...data];  // ✅ spread
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(
      c => Number(c.id) === Number(categoryId)
    );
    return category ? category.name : 'Unknown';
  }

  getInstructorName(instructorId: number): string {
    const instructor = this.instructors.find(
      i => Number(i.id) === Number(instructorId)
    );
    return instructor ? instructor.name : 'Unknown';
  }

  getCourseTitle(courseId: number): string {
    const course = this.courses.find(
      c => Number(c.id) === Number(courseId)
    );
    return course ? course.title : 'Unknown Course';
  }

  enrollInCourse(courseId: number): void {
    const enrollmentData = {
      userId: 1,
      courseId: courseId,
      batchId: 1,
      status: 'enrolled'
    };

    this.enrollmentService.createEnrollment(enrollmentData).subscribe({
      next: () => {
        alert('Enrollment Successful!');
        this.loadEnrollments();
      },
      error: (err) => { console.error(err); }
    });
  }

  deleteEnrollment(id: number): void {
    if (!confirm('Are you sure you want to remove this enrollment?')) return;

    this.enrollmentService.deleteEnrollment(id).subscribe({
      next: () => {
        alert('Enrollment removed');
        this.loadEnrollments();
      },
      error: (err) => { console.error(err); }
    });
  }

  markAsCompleted(enrollment: any): void {
    const updatedEnrollment = { ...enrollment, status: 'completed' };

    this.enrollmentService.updateEnrollment(enrollment.id, updatedEnrollment).subscribe({
      next: () => {
        alert('Course marked as completed');
        this.loadEnrollments();
      },
      error: (err) => { console.error(err); }
    });
  }
}