import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../models/auth/login-request';
import { User   } from '../../../models/user/user';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required],
    });
  }

  
  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.login(loginRequest).subscribe({
        next: (users: User[]) => {
          if (users.length === 0) {
            alert('User not found');

            return;
          }

          const currentUser = users[0];

          if (currentUser.password !== loginRequest.password) {
            alert('Invalid Password');

            return;
          }

          sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

          if (currentUser.role === 'ADMIN') {
            alert('Welcome Admin');

            this.router.navigate(['/admin']);
          } else {
            alert('Welcome Customer');

            this.router.navigate(['/dashboard']);
          }
        },

        error: () => {
          alert('Server Error');
        },
      });
    }
  }
  
}
