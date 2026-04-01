import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { ApiService, Profile, SkillGroup, Project, Experience, Education, Certification } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, pipe, switchMap, tap, delay, catchError } from 'rxjs';

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

export interface GithubStats {
  totalContributions: number;
  contributions: ContributionDay[][];
}

export interface PortfolioState {
  profile: Profile | null;
  about: { paragraphs: string[] } | null;
  skills: SkillGroup[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  githubStats: GithubStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  profile: null,
  about: null,
  skills: [],
  projects: [],
  experience: [],
  education: [],
  certifications: [],
  githubStats: null,
  isLoading: false,
  error: null,
};

export const PortfolioStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(ApiService), http = inject(HttpClient)) => {
    return {
      loadAll: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() => 
            forkJoin({
              profile: api.getProfile(),
              about: api.getAbout(),
              skills: api.getSkills(),
              projects: api.getProjects(),
              experience: api.getExperience(),
              education: api.getEducation(),
              certifications: api.getCertifications(),
              githubStats: http.get<GithubStats>('https://github-contributions-api.deno.dev/nader035.json')
            }).pipe(
              tap((data) => patchState(store, { ...data, isLoading: false })),
              catchError((err) => {
                console.error('PortfolioStore load error:', err);
                patchState(store, { isLoading: false, error: 'Failed to load portfolio data' });
                return of(null);
              })
            )
          )
        )
      ),

      loadAbout: rxMethod<void>(
        pipe(
          switchMap(() => api.getAbout().pipe(
            tap((about) => patchState(store, { about }))
          ))
        )
      ),

      loadGithubStats: rxMethod<void>(
        pipe(
          switchMap(() => http.get<GithubStats>('https://github-contributions-api.deno.dev/nader035.json').pipe(
            // Use microtask delay to avoid ExpressionChangedAfterItHasBeenCheckedError
            delay(0),
            tap((githubStats) => patchState(store, { githubStats }))
          ))
        )
      )
    };
  }),
  withHooks({
    onInit(store) {
      store.loadAll();
    },
  })
);
