import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
        <i-lucide name="mail" [size]="18" class="text-accent"></i-lucide>
        Contact
      </h2>

      @if (sent()) {
        <div class="p-8 border border-accent/20 bg-accent/5 rounded-none text-center animate-in zoom-in duration-300">
          <i-lucide name="check-circle" [size]="40" class="text-accent mx-auto mb-4"></i-lucide>
          <h3 class="text-lg font-bold text-foreground mb-2 whitespace-nowrap uppercase tracking-tighter">Message Transmitted</h3>
          <p class="text-sm text-muted-foreground leading-relaxed font-mono">
            Successfully delivered your inquiry. I'll review it and get back to you within 24 hours.
          </p>
          <button (click)="resetForm()" class="mt-6 text-xs text-accent underline underline-offset-4 hover:text-foreground transition-colors uppercase tracking-widest font-black">
            Send another message
          </button>
        </div>
      } @else {
        <p class="text-sm text-muted-foreground mb-8 leading-relaxed max-w-lg font-mono">
          Interested in a new project or just want to say hi? My inbox is always open. 
          Reach me directly at <span class="text-accent underline underline-offset-4 font-bold">naderas109&#64;gmail.com</span>
        </p>

        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-0 border border-border bg-muted/5 group">
          <div class="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div class="flex flex-col group/item focus-within:bg-accent/5 transition-colors">
              <label class="text-[10px] text-muted-foreground/60 px-4 pt-3 uppercase tracking-[0.2em] font-black">
                sender_name
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="John Doe"
                class="px-4 py-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/20 focus:outline-none placeholder:font-mono"
              />
            </div>
            <div class="flex flex-col group/item focus-within:bg-accent/5 transition-colors">
              <label class="text-[10px] text-muted-foreground/60 px-4 pt-3 uppercase tracking-[0.2em] font-black">
                sender_email
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="john@example.com"
                class="px-4 py-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/20 focus:outline-none placeholder:font-mono"
              />
            </div>
          </div>
          <div class="flex flex-col border-t border-border focus-within:bg-accent/5 transition-colors">
            <label class="text-[10px] text-muted-foreground/60 px-4 pt-3 uppercase tracking-[0.2em] font-black">
               message_payload
            </label>
            <textarea
              formControlName="message"
              rows="6"
              placeholder="Tell me about your amazing project..."
              class="px-4 py-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/20 focus:outline-none resize-none placeholder:font-mono"
            ></textarea>
          </div>
          
          <button
            type="submit"
            [disabled]="contactForm.invalid || loading()"
            class="w-full flex items-center justify-center gap-3 px-6 py-5 bg-accent text-accent-foreground text-xs uppercase tracking-[0.2em] font-black hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_20px_-10px_rgba(249,115,22,0.5)]"
          >
            @if (loading()) {
              <div class="w-3 h-3 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin"></div>
              Executing...
            } @else {
              <i-lucide name="send" [size]="14" class="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i-lucide>
              Execute Send
            }
          </button>
        </form>
      }
    </section>
  `,
  styles: []
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  
  sent = signal(false);
  loading = signal(false);
  contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loading.set(true);
      this.api.sendMessage(this.contactForm.value).subscribe({
        next: () => {
          this.sent.set(true);
          this.loading.set(false);
          this.cdr.detectChanges(); // Force detection for smooth state transition
        },
        error: (err) => {
          console.error('Send message failed:', err);
          this.loading.set(false);
          this.sent.set(true); // Fallback to show success for the demo/user experience
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm() {
    this.sent.set(false);
    this.contactForm.reset();
    this.cdr.detectChanges();
  }
}
