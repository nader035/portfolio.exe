import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../../components/profile/profile.component';
import { AboutComponent } from '../../components/about/about.component';
import { GithubSectionComponent } from '../../components/github-section/github-section.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ExperienceComponent } from '../../components/experience/experience.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { HatchComponent } from '../../components/hatch/hatch.component';
import { SectionComponent } from '../../components/section/section.component';
import { EducationComponent } from '../../components/education/education.component';
import { CertificationsComponent } from '../../components/certifications/certifications.component';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    AboutComponent,
    GithubSectionComponent,
    ProjectsComponent,
    SkillsComponent,
    ExperienceComponent,
    ContactComponent,
    HatchComponent,
    SectionComponent,
    EducationComponent,
    CertificationsComponent,
],
  template: `
    <main>
      <!-- Profile has its own full-width internal borders -->
      <app-profile></app-profile>

      <app-hatch></app-hatch>
      
      <app-section id="about">
        <app-about></app-about>
      </app-section>

      @defer (on viewport) {
        <app-section id="github">
          <app-github-section></app-github-section>
        </app-section>
      } @placeholder {
        <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
      }

      @defer (on viewport) {
        <app-section id="projects">
          <app-projects></app-projects>
        </app-section>
      } @placeholder {
        <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
      }

      @defer (on viewport) {
        <app-section id="skills">
          <app-skills></app-skills>
        </app-section>
      } @placeholder {
        <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
      }

      @defer (on viewport) {
        <app-section id="experience">
          <app-experience></app-experience>
        </app-section>
      } @placeholder {
        <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
      }

      @defer (on viewport) {
        <app-section id="education">
          <app-education></app-education>
        </app-section>
      } @placeholder {
        <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
      }

      @defer (on viewport) {
        <app-section id="certifications">
          <app-certifications></app-certifications>
        </app-section>
      } @placeholder {
        <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
      }

      <app-hatch></app-hatch>

      @defer (on viewport) {
        <app-section id="contact">
          <app-contact></app-contact>
        </app-section>
      } @placeholder {
        <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
      }
    </main>
  `,
  styles: []
})
export class HomeComponent {}
