import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Header],
  template: `
    <div class="page-container">
      <aside class="sidebar">
        <app-sidebar></app-sidebar>
      </aside>

      <main class="content">
        <app-header></app-header>
        <div class="page-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      min-height: 100vh;
      font-family: Georgia, serif;
      background-color: #bdd8e6;
      background-image:
        radial-gradient(ellipse 80% 60% at 15% 25%, rgba(255,255,255,0.38) 0%, transparent 65%),
        radial-gradient(ellipse 60% 70% at 85% 15%, rgba(196,226,240,0.5) 0%, transparent 55%),
        radial-gradient(ellipse 70% 50% at 50% 85%, rgba(148,198,220,0.35) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 75% 60%, rgba(178,214,230,0.3) 0%, transparent 50%),
        radial-gradient(ellipse 50% 30% at 30% 70%, rgba(210,235,245,0.4) 0%, transparent 55%),
        radial-gradient(ellipse 30% 50% at 90% 80%, rgba(130,185,210,0.25) 0%, transparent 45%);
    }
    .sidebar {
      width: 220px;
      flex-shrink: 0;
      background: rgba(255,255,255,0.92);
      padding: 28px 20px;
      box-shadow: 2px 0 24px rgba(0,0,0,0.06);
    }
    .content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
      padding: 30px 28px;
    }
    .page-body {
      flex-grow: 1;
      margin-top: 24px;
    }
    @media (max-width: 1024px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class CoursesComponent {}
