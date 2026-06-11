import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiUrl = 'http://localhost:3000/enrollments';

  constructor(private http: HttpClient) {}

  getEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEnrollment(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  createEnrollment(
    enrollment: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      enrollment
    );
  }

  updateEnrollment(
  id: string | number,
  enrollment: any
) {
  return this.http.put(
    `${this.apiUrl}/${id}`,
    enrollment
  );
}

  deleteEnrollment(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}