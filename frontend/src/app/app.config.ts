import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideHttpClient } from '@angular/common/http';

import { provideRouter } from '@angular/router';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';

import { courseReducer } from './state/course/course.reducer';
import { CourseEffects } from './state/course/course.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideHttpClient()],
};
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    provideStore({
      courses: courseReducer
    }),

    provideEffects([
      CourseEffects
    ])
  ]
};
