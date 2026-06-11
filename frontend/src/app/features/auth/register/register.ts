import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../models/user/user';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user';
import { Profile } from '../../../models/user/profile';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const newUser: User = {
        name: this.registerForm.value.name,

        email: this.registerForm.value.email,

        password: this.registerForm.value.password,

        role: 'CUSTOMER',

        learningPreferences: [],

        skillSummary: '',

        createdAt: new Date().toLocaleDateString(),
      };

      this.userService.registerUser(newUser).subscribe({
        next: (response: User) => {
          const profile: Profile = {
            userId: response.id!,

            phone: '',

            location: '',

            experienceLevel: 'Beginner',

            skills: [],

            learningPreferences: {
              emailNotifications: true,
              darkMode: false,
            },
          };

          this.userService.createProfile(profile).subscribe({
            next: () => {
              alert('Registration Successful');

              this.registerForm.reset();

              this.router.navigate(['/login']);
            },

            error: (err: any) => {
              console.error(err);

              alert('Profile Creation Failed');
            },
          });
        },

        error: (error:any) => {
          console.error(error);

          alert('Registration Failed');
        },
      });
    }
  }
}
