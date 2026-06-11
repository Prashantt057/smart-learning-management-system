import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangePassword } from '../../../models/auth/change-password';
import { AuthService } from '../../../services/auth';
@Component({
  selector: 'app-forgot-password-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      const newPassword = this.forgotPasswordForm.value.newPassword;

      this.authService.getUserByEmail(email).subscribe({
        next: (users) => {
          if (users.length === 0) {
            alert('User not found');

            return;
          }

          const user = users[0];

          this.authService.updatePassword(user.id, newPassword).subscribe({
            next: () => {
              alert('Password Updated Successfully');

              this.forgotPasswordForm.reset();
            },

            error: () => {
              alert('Password Update Failed');
            },
          });
        },
      });
    }
  }
}
