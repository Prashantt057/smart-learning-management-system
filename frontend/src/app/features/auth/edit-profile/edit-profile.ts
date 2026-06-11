import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user';
import { Profile } from '../../../models/user/profile';
import { Router } from '@angular/router';
import { User } from '../../../models/user/user';
import { UpdateUser } from '../../../models/user/update-user';

@Component({
  selector: 'app-edit-profile-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfileComponent implements OnInit {
  editForm!: FormGroup;

  profile!: Profile;

  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.editForm = this.fb.group({
      phone: [''],
      location: [''],
      experienceLevel: [''],
      skills: [''],
    });
  }
  ngOnInit(): void {
    const user = sessionStorage.getItem('currentUser');

    if (!user) {
      this.router.navigate(['/login']);

      return;
    }
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    this.userService.getProfileByUserId(this.currentUser.id).subscribe({
      next: (response: Profile[]) => {
        this.profile = response[0];

        this.editForm = this.fb.group({
          phone: [this.profile.phone, Validators.required],

          location: [this.profile.location, Validators.required],

          experienceLevel: [this.profile.experienceLevel, Validators.required],

          skills: [this.profile.skills.join(', ')],
        });
      },
    });
  }

  updateProfile(): void {
    const updatedProfile: Profile = {
      ...this.profile,

      phone: this.editForm.value.phone,

      location: this.editForm.value.location,

      experienceLevel: this.editForm.value.experienceLevel,

      skills: this.editForm.value.skills.split(',').map((s: string) => s.trim()),
    };

    this.userService.updateProfile(this.profile.id!, updatedProfile).subscribe({
      next: (response: Profile) => {
        this.profile = response;

        alert('Profile Updated Successfully');

        this.router.navigate(['/profile']);
      },

      error: (error) => {
        console.error(error);

        alert('Update Failed');
      },
    });
  }
}
