import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user/user';
import { LoginRequest } from '../models/auth/login-request';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${request.email}`);
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('currentUser');
  }

  getCurrentUser(): User | null {
    const user = sessionStorage.getItem('currentUser');

    return user ? JSON.parse(user) : null;
  }
  
  getUserByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
  }

  updatePassword(id: string, password: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${id}`,

      {
        password: password,
      },
    );
  }
}
