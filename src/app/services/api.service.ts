import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Profile {
  name: string;
  role: string;
  initials: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Project {
  name: string;
  status: string;
  year: string;
  desc: string;
  tags: string[];
  repo: string | null;
  live: string | null;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  period: string;
}

export interface Certification {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getProfile(): Observable<Profile> {
    return from(
      this.supabase.from('profile').select('*').single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Profile;
      })
    );
  }

  getAbout(): Observable<{ paragraphs: string[] }> {
    return from(
      this.supabase.from('about').select('*').single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as { paragraphs: string[] };
      })
    );
  }

  getSkills(): Observable<SkillGroup[]> {
    return from(
      this.supabase.from('skills').select('*').order('sort_order', { ascending: true })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as SkillGroup[];
      })
    );
  }

  getProjects(): Observable<Project[]> {
    return from(
      this.supabase.from('projects').select('*').order('sort_order', { ascending: true })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        // Map table column names to existing interface
        return res.data.map((item: any) => ({
          ...item,
          desc: item.description,
          repo: item.repo_url,
          live: item.live_url
        })) as Project[];
      })
    );
  }

  getExperience(): Observable<Experience[]> {
    return from(
      this.supabase.from('experience').select('*').order('sort_order', { ascending: true })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Experience[];
      })
    );
  }

  getEducation(): Observable<Education[]> {
    return from(
      this.supabase.from('education').select('*')
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Education[];
      })
    );
  }

  getCertifications(): Observable<Certification[]> {
    return from(
      this.supabase.from('certifications').select('*')
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Certification[];
      })
    );
  }
}
