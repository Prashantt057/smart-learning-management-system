import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user/user';
import { Profile } from '../models/user/profile';
import { UpdateUser } from '../models/user/update-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  createProfile(profile: Profile) {
    return this.http.post<Profile>('http://localhost:3000/profiles', profile);
  }
  getProfileByUserId(userId: string) {
    return this.http.get<Profile[]>(`http://localhost:3000/profiles?userId=${userId}`);
  }

  updateProfile(id: string, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`http://localhost:3000/profiles/${id}`, profile);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
