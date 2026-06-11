import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Instructor } from '../models/instructor.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private apiUrl = 'http://localhost:3000/instructors';

  constructor(private http: HttpClient) {}

  getInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.apiUrl);
  }
}