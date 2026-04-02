import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LucideAngularModule, Sun, Moon, MapPin, Mail, Phone, Github, Linkedin, ExternalLink, Send, Star, GitFork, Terminal, Code, Cpu, Award, GraduationCap, Briefcase } from 'lucide-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    })), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ Sun, Moon, MapPin, Mail, Phone, Github, Linkedin, ExternalLink, Send, Star, GitFork, Terminal, Code, Cpu, Award, GraduationCap, Briefcase }))
  ]
};
