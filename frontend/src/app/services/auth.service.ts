import { Injectable, signal } from '@angular/core';

export type UserRole = 'Customer' | 'Admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to store current active role, defaulting to Admin to test course creation
  private currentRoleSignal = signal<UserRole>('Admin');

  // Read-only signal access
  currentRole = this.currentRoleSignal.asReadonly();

  toggleRole() {
    this.currentRoleSignal.update(role => role === 'Admin' ? 'Customer' : 'Admin');
  }

  setRole(role: UserRole) {
    this.currentRoleSignal.set(role);
  }

  isAdmin(): boolean {
    return this.currentRoleSignal() === 'Admin';
  }
}
