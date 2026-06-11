import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/courses';

  getCourses(filters?: { search?: string; category?: string; level?: string; availability?: string }): Observable<Course[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.level) params = params.set('level', filters.level);
      if (filters.availability) params = params.set('availability', filters.availability);
    }
    return this.http.get<Course[]>(this.apiUrl, { params });
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
