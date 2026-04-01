import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LucideAngularModule, Sun, Moon, MapPin, Mail, Phone, Github, Linkedin, ExternalLink, Send, Star, GitFork } from 'lucide-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ Sun, Moon, MapPin, Mail, Phone, Github, Linkedin, ExternalLink, Send, Star, GitFork }))
  ]
};
