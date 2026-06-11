import { Component } from '@angular/core';
import { UserPreferences } from '../../../models/user/user-preferences';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-preferences',
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
}) 


export class PreferencesComponent {

  preferences: UserPreferences = {

    userId: 0,

    emailNotifications: true,

    sessionReminders: true,

    assessmentReminders: true,

    dashboardTheme: 'Light'

  };

  savePreferences() {

    alert(
      'Preferences Saved'
    );

  }


}
