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
import { TerminalSectionComponent } from '../../components/terminal-section/terminal-section.component';
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
    TerminalSectionComponent,
],
  template: `
    <main>
      <!-- Profile has its own full-width internal borders -->
      <app-profile></app-profile>

      <app-hatch></app-hatch>
      
      <app-section id="about">
        <app-about></app-about>
      </app-section>

      <app-section id="terminal">
        @defer (on viewport) {
          <app-terminal-section></app-terminal-section>
        } @placeholder {
          <div class="h-80 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>

      <app-section id="github">
        @defer (on viewport) {
          <app-github-section></app-github-section>
        } @placeholder {
          <div class="h-64 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>

      <app-section id="projects">
        @defer (on viewport) {
          <app-projects></app-projects>
        } @placeholder {
          <div class="h-96 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>

      <app-section id="skills">
        @defer (on viewport) {
          <app-skills></app-skills>
        } @placeholder {
          <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>

      <app-section id="experience">
        @defer (on viewport) {
          <app-experience></app-experience>
        } @placeholder {
          <div class="h-96 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>

      <app-section id="education">
        @defer (on viewport) {
          <app-education></app-education>
        } @placeholder {
          <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>

      <app-section id="certifications">
        @defer (on viewport) {
          <app-certifications></app-certifications>
        } @placeholder {
          <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>

      <app-hatch></app-hatch>

      <app-section id="contact">
        @defer (on viewport) {
          <app-contact></app-contact>
        } @placeholder {
          <div class="h-40 bg-muted/20 animate-pulse m-6"></div>
        }
      </app-section>
    </main>
  `,
  styles: []
})
export class HomeComponent {}
