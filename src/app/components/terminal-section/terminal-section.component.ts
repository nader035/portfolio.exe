import { Component, ElementRef, ViewChild, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalPanelComponent } from '../terminal-panel/terminal-panel.component';

interface TerminalLine {
  type: 'command' | 'response' | 'system' | 'error';
  content: string;
  timestamp: Date;
}

const RESUME_URL = 'https://gqqwlnmrlofcaqsueqdb.supabase.co/storage/v1/object/public/resume/Nader-Resume.pdf';

@Component({
  selector: 'app-terminal-section',
  standalone: true,
  imports: [CommonModule, FormsModule, TerminalPanelComponent],
  template: `
    <div id="terminal" class="py-12 scroll-mt-20">
      <app-terminal-panel label="Interactive Terminal" statusDot="green" className="max-w-4xl mx-auto shadow-2xl overflow-hidden border-glow">
        <div 
          class="terminal-content font-mono text-sm md:text-base h-[450px] flex flex-col cursor-text p-4"
          (click)="focusInput()"
        >
          <!-- History -->
          <div #historyContainer class="flex-grow overflow-y-auto mb-4 space-y-2 pr-2 custom-scrollbar">
            <div class="text-muted-foreground italic mb-6 opacity-70 border-b border-border/30 pb-2">
              NaderOS [Version 21.0.4] (c) 2026 Nader Corporation. All rights reserved.
              <br>Type 'help' to initialize command interface.
            </div>
            
            @for (line of history(); track $index) {
              <div [ngClass]="{
                'text-primary': line.type === 'command',
                'text-foreground': line.type === 'response',
                'text-accent': line.type === 'system',
                'text-destructive': line.type === 'error'
              }" class="break-words animate-in fade-in slide-in-from-left-1 duration-300">
                @if (line.type === 'command') {
                  <span class="text-accent font-bold">visitor&#64;nader-portfolio:~$</span>
                }
                <span class="ml-2 whitespace-pre-wrap">{{ line.content }}</span>
              </div>
            }

            @if (isProcessing()) {
              <div class="text-accent flex items-center gap-2">
                <span class="animate-bounce">●</span>
                <span class="text-xs uppercase tracking-tighter opacity-50">Processing request...</span>
              </div>
            }
          </div>

          <!-- Suggestions -->
          @if (suggestions().length > 0) {
            <div class="flex flex-wrap gap-2 px-3 py-2 mb-3 bg-accent/5 rounded border border-accent/20 animate-in fade-in slide-in-from-bottom-2">
              <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter self-center mr-1">Suggestions:</span>
              @for (suggestion of suggestions(); track suggestion) {
                <span 
                  class="text-[11px] px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  (click)="completeCommand(suggestion)"
                >
                  {{ suggestion }}
                </span>
              }
              <span class="text-[10px] text-muted-foreground self-center ml-auto hidden sm:inline opacity-40">[TAB] to complete</span>
            </div>
          }

          <!-- Input Area -->
          <div class="flex items-center gap-2 border-t border-border/30 pt-4 bg-background/30 relative">
            <span class="text-accent shrink-0 font-bold text-xs md:text-sm">visitor&#64;nader-portfolio:~$</span>
            <div class="relative flex-grow">
              <input 
                #terminalInput
                type="text" 
                [ngModel]="currentCommand()" 
                (ngModelChange)="currentCommand.set($event)"
                (keydown.enter)="handleEnter()"
                (keydown.tab)="handleTab($any($event))"
                [disabled]="isProcessing()"
                class="bg-transparent border-none outline-none w-full text-foreground caret-accent selection:bg-accent/30"
                aria-label="Terminal input"
                placeholder="Type 'help'..."
                autocomplete="off"
              />
              <!-- Ghost Suggestion -->
              @if (suggestions().length > 0) {
                <span class="absolute left-0 top-0 pointer-events-none text-muted-foreground/20 whitespace-pre">
                  <span class="text-transparent">{{ currentCommand() }}</span>{{ suggestions()[0].slice(currentCommand().length) }}
                </span>
              }
            </div>
          </div>
        </div>
      </app-terminal-panel>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: hsl(var(--border) / 0.3);
      border-radius: 10px;
    }
  `]
})
export class TerminalSectionComponent {
  @ViewChild('historyContainer') private historyContainer!: ElementRef;
  @ViewChild('terminalInput') private terminalInput!: ElementRef;

  history = signal<TerminalLine[]>([]);
  currentCommand = signal('');
  isProcessing = signal(false);

  private readonly commands = ['help', 'resume', 'cv', 'clear', 'whoami', 'projects', 'github', 'contact'];
  
  suggestions = computed(() => {
    const input = this.currentCommand().trim().toLowerCase();
    if (!input) return [];
    return this.commands.filter(cmd => cmd.startsWith(input) && cmd !== input);
  });

  constructor() {
    effect(() => {
      this.history();
      setTimeout(() => this.scrollToBottom(), 10);
    });
  }

  focusInput() {
    this.terminalInput?.nativeElement?.focus();
  }

  completeCommand(suggestion: string) {
    this.currentCommand.set(suggestion);
    setTimeout(() => this.focusInput(), 10);
  }

  handleTab(event: KeyboardEvent) {
    if (this.suggestions().length > 0) {
      event.preventDefault();
      this.completeCommand(this.suggestions()[0]);
    }
  }

  handleEnter() {
    const cmd = this.currentCommand().trim().toLowerCase();
    if (!cmd) return;

    this.addHistory(cmd, 'command');
    this.currentCommand.set('');
    this.processCommand(cmd);
  }

  private async processCommand(cmd: string) {
    switch (cmd) {
      case 'help':
        this.addHistory('Available commands: \n  - projects: View featured work\n  - resume: Download my CV\n  - github: Visit profile\n  - whoami: Developer bio\n  - contact: Get in touch\n  - clear: Reset terminal', 'response');
        break;
      
      case 'cv':
      case 'resume':
        await this.runDownloadSequence();
        break;

      case 'projects':
        this.addHistory('Loading portfolio index... \n- [Interactive Dashboard]\n- [AI Integration Hub]\n- [Ecommerce Revamp]', 'response');
        this.addHistory('Scrolling to Projects section...', 'system');
        setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 500);
        break;

      case 'github':
        this.addHistory('Navigating to github.com/nader035...', 'system');
        setTimeout(() => window.open('https://github.com/nader035', '_blank'), 500);
        break;

      case 'contact':
        this.addHistory('Redirecting to mail client...', 'system');
        setTimeout(() => window.location.href = 'mailto:nadercoder@gmail.com', 500);
        break;

      case 'clear':
        this.history.set([]);
        break;

      case 'whoami':
        this.addHistory('Full-stack developer specializing in modern web architectures and premium UI/UX experiences.', 'response');
        break;

      default:
        this.addHistory(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        break;
    }
  }

  private async runDownloadSequence() {
    this.isProcessing.set(true);
    this.addHistory('Fetching Nader_Resume.pdf...', 'system');
    await this.delay(600);

    const steps = 20;
    const duration = 2000;
    const interval = duration / steps;

    this.addHistory('[                    ] 0%', 'system');
    
    for (let i = 1; i <= steps; i++) {
      await this.delay(interval);
      const progress = Math.round((i / steps) * 100);
      const progressBar = '[' + '#'.repeat(Math.round((i / steps) * 20)) + '.'.repeat(20 - Math.round((i / steps) * 20)) + ']';
      this.updateLastHistory(`${progressBar} ${progress}%`);
    }

    await this.delay(400);
    this.addHistory('Download complete. Opening file...', 'system');
    window.open(RESUME_URL, '_blank');
    this.isProcessing.set(false);
    setTimeout(() => this.focusInput(), 100);
  }

  private addHistory(content: string, type: TerminalLine['type']) {
    this.history.update(h => [...h, { content, type, timestamp: new Date() }]);
  }

  private updateLastHistory(content: string) {
    this.history.update(h => {
      const newHistory = [...h];
      if (newHistory.length > 0) {
        newHistory[newHistory.length - 1] = { ...newHistory[newHistory.length - 1], content };
      }
      return newHistory;
    });
  }

  private scrollToBottom() {
    if (this.historyContainer) {
      const el = this.historyContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
