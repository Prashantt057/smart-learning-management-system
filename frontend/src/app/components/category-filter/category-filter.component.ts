import { Component, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterState {
  search: string;
  category: string;
  level: string;
  availability: string;
}

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-panel">
      <div class="filter-header">
        <h3>Filter Courses</h3>
        <button class="btn-clear" (click)="resetFilters()">Clear All</button>
      </div>

      <div class="filter-grid">
        <!-- Search Input -->
        <div class="filter-field">
          <label class="filter-label">Search</label>
          <input 
            type="text" 
            [(ngModel)]="search" 
            (ngModelChange)="onFilterChange()"
            placeholder="Search title, description, instructor..."
            class="filter-input"
          />
        </div>

        <!-- Category Select -->
        <div class="filter-field">
          <label class="filter-label">Category</label>
          <select 
            [(ngModel)]="category" 
            (ngModelChange)="onFilterChange()"
            class="filter-select"
          >
            <option value="">All Categories</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

        <!-- Level Select -->
        <div class="filter-field">
          <label class="filter-label">Level</label>
          <select 
            [(ngModel)]="level" 
            (ngModelChange)="onFilterChange()"
            class="filter-select"
          >
            <option value="">All Levels</option>
            @for (lvl of levels; track lvl) {
              <option [value]="lvl">{{ lvl }}</option>
            }
          </select>
        </div>

        <!-- Availability Select -->
        <div class="filter-field">
          <label class="filter-label">Availability</label>
          <select 
            [(ngModel)]="availability" 
            (ngModelChange)="onFilterChange()"
            class="filter-select"
          >
            <option value="">All Availabilities</option>
            @for (avail of availabilities; track avail) {
              <option [value]="avail">{{ avail }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-md);
    }
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
    }
    .filter-header h3 {
      font-size: 1.2rem;
      font-weight: 600;
    }
    .btn-clear {
      background: none;
      border: none;
      color: var(--accent-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      transition: var(--transition-fast);
    }
    .btn-clear:hover {
      color: var(--accent-primary);
      background-color: rgba(255, 255, 255, 0.03);
    }
    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }
    .filter-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .filter-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .filter-input, .filter-select {
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.7rem 0.9rem;
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 0.9rem;
      transition: var(--transition-fast);
      width: 100%;
    }
    .filter-input:focus, .filter-select:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 2px var(--border-focus);
    }
  `]
})
export class CategoryFilterComponent {
  // Filters output emitter
  filterChanged = output<FilterState>();

  // Local filter states
  search = '';
  category = '';
  level = '';
  availability = '';

  // Dropdown list configurations
  categories = ['Web Development', 'Data Science', 'Design'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];
  availabilities = ['Available', 'Upcoming', 'Closed'];

  onFilterChange() {
    this.filterChanged.emit({
      search: this.search,
      category: this.category,
      level: this.level,
      availability: this.availability
    });
  }

  resetFilters() {
    this.search = '';
    this.category = '';
    this.level = '';
    this.availability = '';
    this.onFilterChange();
  }
}
