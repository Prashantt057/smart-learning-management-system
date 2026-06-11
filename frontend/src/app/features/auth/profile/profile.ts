import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Profile } from '../../../models/user/profile';
import { UserService } from '../../../services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {

  currentUser: any = null;

  profile = signal<Profile>({
    userId: '',
    phone: '',
    location: '',
    experienceLevel: '',
    skills: [],
    learningPreferences: {
      emailNotifications: false,
      darkMode: false,
    },
  });

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const user = sessionStorage.getItem('currentUser');

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = JSON.parse(user);

    console.log('Current User:', this.currentUser);

    this.userService
      .getProfileByUserId(this.currentUser.id)
      .subscribe({
        next: (response: Profile[]) => {

          console.log('Profile Response:', response);

          if (response.length > 0) {
            this.profile.set(response[0]);

            console.log('Assigned Profile:', this.profile());
          }
        },

        error: (err) => {
          console.error(err);
        },
      });
  }
}