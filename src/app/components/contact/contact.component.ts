import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">Contact</h2>

      @if (sent) {
        <p class="text-sm text-muted-foreground">
          <span class="text-accent">$</span> Message sent — I'll be in touch soon.
        </p>
      } @else {
        <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
          Open to full-time roles and interesting freelance projects. Usually reply within 24h.
        </p>
        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-0 border border-border divide-y divide-border">
          <div class="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div class="flex flex-col">
              <label class="text-xs text-muted-foreground px-3 pt-2.5 uppercase tracking-widest border-b border-border pb-1">
                name
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="Your name"
                class="px-3 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-xs text-muted-foreground px-3 pt-2.5 uppercase tracking-widest border-b border-border pb-1">
                email
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                class="px-3 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-xs text-muted-foreground px-3 pt-2.5 uppercase tracking-widest border-b border-border pb-1">
              message
            </label>
            <textarea
              formControlName="message"
              rows="5"
              placeholder="What's on your mind?"
              class="px-3 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            [disabled]="contactForm.invalid"
            class="w-full flex items-center justify-center gap-2 px-5 py-3 bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i-lucide name="send" [size]="13"></i-lucide>
            Send message
          </button>
        </form>
      }
    </section>
  `,
  styles: []
})
export class ContactComponent {
  sent = false;
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.sent = true;
    }
  }
}
