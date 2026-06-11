import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { DashboardStats } from '../../../components/dashboard-stats/dashboard-stats';

import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Header,
    DashboardStats
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  courses: any[] = [];

  constructor(
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        console.log('Courses:', data);
        this.courses = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}