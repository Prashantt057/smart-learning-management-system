import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  get greeting(): string {
    const hours = new Date().getHours();
    if (hours < 12) {
      return 'Good Morning';
    } else if (hours < 16) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }
}
