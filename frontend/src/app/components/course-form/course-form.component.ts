import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { CourseActions } from '../../state/course/course.actions';
import { selectSelectedCourse, selectCoursesLoading, selectCoursesError } from '../../state/course/course.selectors';
import { Course } from '../../models/course.model';
import { durationFormatValidator, noSelfPrerequisiteValidator } from '../../validators/course.validators';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-page fade-in">
      <div class="navigation-bar">
        <a routerLink="/courses" class="btn-back">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-arrow"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Catalog
        </a>
      </div>

      <div class="form-card card">
        <h1 class="form-title">{{ isEditMode ? 'Edit Course' : 'Create New Course' }}</h1>
        <p class="form-subtitle">Fill in the fields below to update the learning management syllabus and metadata</p>

        @if (loading$ | async) {
          <div class="form-loading">
            <div class="spinner"></div>
            <p>Loading course information...</p>
          </div>
        }

        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="course-form-element">
          <!-- Main Form Grid -->
          <div class="inputs-grid">
            <!-- Title -->
            <div class="form-group span-2">
              <label class="form-label" for="title">Course Title</label>
              <input type="text" id="title" formControlName="title" class="form-control" placeholder="e.g. Advanced Angular Development"/>
              @if (courseForm.get('title')?.touched && courseForm.get('title')?.invalid) {
                <div class="form-error">
                  @if (courseForm.get('title')?.hasError('required')) { <span>Title is required.</span> }
                  @if (courseForm.get('title')?.hasError('minlength')) { <span>Title must be at least 3 characters.</span> }
                </div>
              }
            </div>

            <!-- Instructor -->
            <div class="form-group">
              <label class="form-label" for="instructor">Instructor Name</label>
              <input type="text" id="instructor" formControlName="instructor" class="form-control" placeholder="e.g. Sarah Jenkins"/>
              @if (courseForm.get('instructor')?.touched && courseForm.get('instructor')?.invalid) {
                <div class="form-error">
                  <span>Instructor name is required.</span>
                </div>
              }
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label" for="category">Category</label>
              <select id="category" formControlName="category" class="form-control">
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
              </select>
              @if (courseForm.get('category')?.touched && courseForm.get('category')?.invalid) {
                <div class="form-error">
                  <span>Please select a category.</span>
                </div>
              }
            </div>

            <!-- Duration -->
            <div class="form-group">
              <label class="form-label" for="duration">Duration</label>
              <input type="text" id="duration" formControlName="duration" class="form-control" placeholder="e.g. 8 Weeks"/>
              @if (courseForm.get('duration')?.touched && courseForm.get('duration')?.invalid) {
                <div class="form-error">
                  @if (courseForm.get('duration')?.hasError('required')) { <span>Duration is required.</span> }
                  @if (courseForm.get('duration')?.hasError('invalidDurationPattern')) { <span>Format must be 'Number' and 'Weeks/Months/Days' (e.g. 6 Weeks).</span> }
                </div>
              }
            </div>

            <!-- Level -->
            <div class="form-group">
              <label class="form-label" for="level">Difficulty Level</label>
              <select id="level" formControlName="level" class="form-control">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <!-- Availability -->
            <div class="form-group">
              <label class="form-label" for="availability">Availability Status</label>
              <select id="availability" formControlName="availability" class="form-control">
                <option value="Available">Available</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <!-- Completion Status -->
            <div class="form-group">
              <label class="form-label" for="completionStatus">Completion Status</label>
              <select id="completionStatus" formControlName="completionStatus" class="form-control">
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <!-- Image URL -->
            <div class="form-group span-2">
              <label class="form-label" for="imageUrl">Image URL (Optional)</label>
              <input type="text" id="imageUrl" formControlName="imageUrl" class="form-control" placeholder="https://images.unsplash.com/..."/>
            </div>

            <!-- Description -->
            <div class="form-group span-2">
              <label class="form-label" for="description">Course Description</label>
              <textarea id="description" formControlName="description" class="form-control text-area" rows="4" placeholder="Provide a brief synopsis of the course curriculum and target students..."></textarea>
              @if (courseForm.get('description')?.touched && courseForm.get('description')?.invalid) {
                <div class="form-error">
                  @if (courseForm.get('description')?.hasError('required')) { <span>Description is required.</span> }
                  @if (courseForm.get('description')?.hasError('minlength')) { <span>Description must be at least 10 characters.</span> }
                </div>
              }
            </div>
          </div>

          <!-- Dynamic Arrays Sections -->
          <div class="dynamic-sections">
            
            <!-- Objectives Section (FormArray) -->
            <div class="form-section-box">
              <div class="section-title-row">
                <h3>Learning Objectives</h3>
                <button type="button" class="btn btn-secondary btn-sm-add" (click)="addObjective()">+ Add Objective</button>
              </div>
              <p class="section-hint">Provide at least one learning objective for the course.</p>
              
              <div formArrayName="objectives" class="form-array-list">
                @for (objControl of objectivesFormArray.controls; track objControl; let i = $index) {
                  <div class="array-item-row">
                    <input type="text" [formControlName]="i" class="form-control" placeholder="e.g. Create responsive templates"/>
                    <button type="button" class="btn-remove-item" (click)="removeObjective(i)">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="del-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                }
              </div>
              @if (objectivesFormArray.touched && objectivesFormArray.invalid) {
                <div class="form-error">
                  <span>Please provide at least one objective.</span>
                </div>
              }
            </div>

            <!-- Prerequisites Section (FormArray) -->
            <div class="form-section-box">
              <div class="section-title-row">
                <h3>Prerequisites</h3>
                <button type="button" class="btn btn-secondary btn-sm-add" (click)="addPrerequisite()">+ Add Prerequisite</button>
              </div>
              <p class="section-hint">Avoid circular dependencies (i.e. do not set the course title as a prerequisite).</p>
              
              <div formArrayName="prerequisites" class="form-array-list">
                @for (prereqControl of prerequisitesFormArray.controls; track prereqControl; let i = $index) {
                  <div class="array-item-row">
                    <input type="text" [formControlName]="i" class="form-control" placeholder="e.g. Introduction to TypeScript"/>
                    <button type="button" class="btn-remove-item" (click)="removePrerequisite(i)">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="del-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                  @if (prerequisitesFormArray.at(i).touched && prerequisitesFormArray.at(i).invalid) {
                    <div class="form-error">
                      @if (prerequisitesFormArray.at(i).hasError('selfPrerequisite')) { <span>A course cannot list itself as a prerequisite!</span> }
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Syllabus Section (FormArray) -->
            <div class="form-section-box">
              <div class="section-title-row">
                <h3>Syllabus Modules</h3>
                <button type="button" class="btn btn-secondary btn-sm-add" (click)="addSyllabusModule()">+ Add Module</button>
              </div>
              <p class="section-hint">Provide modules in format "Module Name: Subtopics" or just the module details.</p>
              
              <div formArrayName="syllabus" class="form-array-list">
                @for (syllabusControl of syllabusFormArray.controls; track syllabusControl; let i = $index) {
                  <div class="array-item-row">
                    <input type="text" [formControlName]="i" class="form-control" placeholder="e.g. Module 1: Introduction to CLI"/>
                    <button type="button" class="btn-remove-item" (click)="removeSyllabusModule(i)">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="del-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                }
              </div>
              @if (syllabusFormArray.touched && syllabusFormArray.invalid) {
                <div class="form-error">
                  <span>Please provide at least one syllabus module.</span>
                </div>
              }
            </div>

          </div>

          <!-- Action buttons -->
          <div class="form-actions">
            <a routerLink="/courses" class="btn btn-secondary">Cancel</a>
            <button type="submit" [disabled]="courseForm.invalid" class="btn btn-primary">
              {{ isEditMode ? 'Save Changes' : 'Create Course' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-page {
      max-width: 800px;
      margin: 0 auto;
    }
    .navigation-bar {
      margin-bottom: 1.5rem;
    }
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .btn-back:hover {
      color: var(--text-primary);
    }
    .icon-arrow {
      width: 1.2rem;
      height: 1.2rem;
    }
    .form-title {
      font-size: 1.8rem;
      margin-bottom: 0.25rem;
    }
    .form-subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }
    .inputs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 600px) {
      .inputs-grid {
        grid-template-columns: 1fr;
      }
      .span-2 {
        grid-column: span 1 !important;
      }
    }
    .span-2 {
      grid-column: span 2;
    }
    .text-area {
      resize: vertical;
      font-family: inherit;
    }
    .dynamic-sections {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .form-section-box {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      background-color: rgba(255, 255, 255, 0.01);
    }
    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    .section-title-row h3 {
      font-size: 1.15rem;
    }
    .btn-sm-add {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      color: var(--accent-secondary);
      border-radius: var(--radius-sm);
    }
    .btn-sm-add:hover {
      background-color: rgba(6, 182, 212, 0.1);
      color: white;
      border-color: var(--accent-secondary);
    }
    .section-hint {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    .form-array-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .array-item-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .btn-remove-item {
      background-color: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      width: 2.2rem;
      height: 2.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      cursor: pointer;
      flex-shrink: 0;
      transition: var(--transition-fast);
    }
    .btn-remove-item:hover {
      background-color: var(--accent-danger);
      color: white;
      border-color: var(--accent-danger);
    }
    .del-icon {
      width: 1.1rem;
      height: 1.1rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2.5rem;
      border-top: 1px solid var(--border-color);
      padding-top: 1.5rem;
    }
    .form-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.05);
      border-top: 3px solid var(--accent-secondary);
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      animation: spin 1s linear infinite;
      margin-bottom: 0.75rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class CourseFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  courseForm!: FormGroup;
  isEditMode = false;
  courseId: string | null = null;
  loading$ = this.store.select(selectCoursesLoading);
  error$ = this.store.select(selectCoursesError);
  
  private sub?: Subscription;

  ngOnInit() {
    this.initForm();

    this.sub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.courseId = id;
        this.store.dispatch(CourseActions.loadCourse({ id }));
        
        // Listen to selected course and populate form
        this.store.select(selectSelectedCourse)
          .pipe(
            filter((course): course is Course => !!course),
            take(1)
          )
          .subscribe(course => {
            this.populateForm(course);
          });
      } else {
        this.isEditMode = false;
        this.courseId = null;
        // Seed default template arrays
        this.addObjective();
        this.addSyllabusModule();
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private initForm() {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      duration: ['', [Validators.required, durationFormatValidator()]],
      level: ['Beginner', Validators.required],
      instructor: ['', Validators.required],
      completionStatus: ['Not Started', Validators.required],
      availability: ['Available', Validators.required],
      imageUrl: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      objectives: this.fb.array([], Validators.required),
      prerequisites: this.fb.array([]),
      syllabus: this.fb.array([], Validators.required)
    });
  }

  private populateForm(course: Course) {
    this.courseForm.patchValue({
      title: course.title,
      category: course.category,
      duration: course.duration,
      level: course.level,
      instructor: course.instructor,
      completionStatus: course.completionStatus,
      availability: course.availability,
      imageUrl: course.imageUrl || '',
      description: course.description
    });

    // Clear dynamic arrays and load data from course details
    const objArray = this.objectivesFormArray;
    const prereqArray = this.prerequisitesFormArray;
    const syllabusArray = this.syllabusFormArray;

    objArray.clear();
    prereqArray.clear();
    syllabusArray.clear();

    course.objectives.forEach(obj => objArray.push(this.fb.control(obj, Validators.required)));
    course.prerequisites.forEach(pr => prereqArray.push(this.fb.control(pr, [Validators.required, noSelfPrerequisiteValidator('title')])));
    course.syllabus.forEach(syl => syllabusArray.push(this.fb.control(syl, Validators.required)));
  }

  // Objectives getters and handlers
  get objectivesFormArray(): FormArray {
    return this.courseForm.get('objectives') as FormArray;
  }

  addObjective() {
    this.objectivesFormArray.push(this.fb.control('', Validators.required));
  }

  removeObjective(index: number) {
    this.objectivesFormArray.removeAt(index);
  }

  // Prerequisites getters and handlers
  get prerequisitesFormArray(): FormArray {
    return this.courseForm.get('prerequisites') as FormArray;
  }

  addPrerequisite() {
    this.prerequisitesFormArray.push(this.fb.control('', [Validators.required, noSelfPrerequisiteValidator('title')]));
  }

  removePrerequisite(index: number) {
    this.prerequisitesFormArray.removeAt(index);
  }

  // Syllabus getters and handlers
  get syllabusFormArray(): FormArray {
    return this.courseForm.get('syllabus') as FormArray;
  }

  addSyllabusModule() {
    this.syllabusFormArray.push(this.fb.control('', Validators.required));
  }

  removeSyllabusModule(index: number) {
    this.syllabusFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      return;
    }

    const formVal = this.courseForm.value;
    
    // Clean up empty lines or whitespaces
    const cleanedCourse: Partial<Course> = {
      title: formVal.title.trim(),
      category: formVal.category,
      duration: formVal.duration.trim(),
      level: formVal.level,
      instructor: formVal.instructor.trim(),
      completionStatus: formVal.completionStatus,
      availability: formVal.availability,
      imageUrl: formVal.imageUrl ? formVal.imageUrl.trim() : undefined,
      description: formVal.description.trim(),
      objectives: formVal.objectives.map((o: string) => o.trim()),
      prerequisites: formVal.prerequisites.map((p: string) => p.trim()),
      syllabus: formVal.syllabus.map((s: string) => s.trim())
    };

    if (this.isEditMode && this.courseId) {
      this.store.dispatch(CourseActions.updateCourse({ id: this.courseId, course: cleanedCourse }));
    } else {
      this.store.dispatch(CourseActions.createCourse({ course: cleanedCourse }));
    }
  }
}
