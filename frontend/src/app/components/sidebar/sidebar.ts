import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  logout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      this.authService.logout();

      alert('Logged Out Successfully');

      this.router.navigate(['/login']);
    }
  }
}
