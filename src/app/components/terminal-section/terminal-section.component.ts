import { Component, ElementRef, ViewChild, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalPanelComponent } from '../terminal-panel/terminal-panel.component';

interface TerminalLine {
  type: 'command' | 'response' | 'system' | 'error';
  content: string;
  timestamp: Date;
}

const RESUME_URL = 'https://gqqwlnmrlofcaqsueqdb.supabase.co/storage/v1/object/public/resume/Nader-Resume.pdf'; // Placeholder as requested

@Component({
  selector: 'app-terminal-section',
  standalone: true,
  imports: [CommonModule, FormsModule, TerminalPanelComponent],
  template: `
    <div class="py-8 scroll-mt-12">
      <app-terminal-panel label="Interactive Terminal" statusDot="green" className="max-w-4xl mx-auto shadow-2xl overflow-hidden">
        <div 
          class="terminal-content font-mono text-sm md:text-base h-[400px] flex flex-col cursor-text"
          (click)="focusInput()"
        >
          <!-- History -->
          <div #historyContainer class="flex-grow overflow-y-auto mb-4 space-y-2 pr-2 custom-scrollbar">
            <div class="text-muted-foreground italic mb-4">
              Welcome to Nader's Interactive Terminal. Type 'help' to see available commands.
            </div>
            
            @for (line of history(); track $index) {
              <div [ngClass]="{
                'text-primary': line.type === 'command',
                'text-foreground': line.type === 'response',
                'text-accent': line.type === 'system',
                'text-destructive': line.type === 'error'
              }" class="break-words">
                @if (line.type === 'command') {
                  <span class="text-accent font-bold">visitor&#64;nader-portfolio:~$</span>
                }
                <span class="ml-2 whitespace-pre-wrap">{{ line.content }}</span>
              </div>
            }

            @if (isProcessing()) {
              <div class="text-accent animate-pulse">
                <span class="mr-2 ml-2">_</span>
              </div>
            }
          </div>

          <!-- Input Area -->
          <div class="flex items-center gap-2 border-t border-border pt-4 bg-background/50">
            <span class="text-accent shrink-0 font-bold text-xs md:text-sm">visitor&#64;nader-portfolio:~$</span>
            <input 
              #terminalInput
              type="text" 
              [(ngModel)]="currentCommand" 
              (keydown.enter)="handleEnter()"
              [disabled]="isProcessing()"
              class="bg-transparent border-none outline-none flex-grow text-foreground caret-primary w-full"
              autofocus
              aria-label="Terminal input"
              placeholder="Enter command..."
            />
          </div>
        </div>
      </app-terminal-panel>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .terminal-content {
      background-color: transparent;
    }
    input:focus {
      outline: none;
    }
    /* Hide scrollbar for cleaner look, but allow scrolling */
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
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
  currentCommand = '';
  isProcessing = signal(false);

  constructor() {
    // Auto-scroll effect
    effect(() => {
      this.history(); // Track signal
      setTimeout(() => this.scrollToBottom(), 10);
    });
  }

  focusInput() {
    if (this.terminalInput) {
      this.terminalInput.nativeElement.focus();
    }
  }

  handleEnter() {
    const cmd = this.currentCommand.trim().toLowerCase();
    if (!cmd) return;

    // Add command to history
    this.addHistory(cmd, 'command');
    this.currentCommand = '';

    this.processCommand(cmd);
  }

  private async processCommand(cmd: string) {
    switch (cmd) {
      case 'help':
        this.addHistory('Available commands: \n  - cv / download cv: Get my resume\n  - clear: Clear terminal history\n  - whoami: About me\n  - help: Show this menu', 'response');
        break;
      
      case 'cv':
      case 'download cv':
        await this.runDownloadSequence();
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

    let lineIndex = this.history().length;
    this.addHistory('[                    ] 0%', 'system');
    
    for (let i = 1; i <= steps; i++) {
      await this.delay(interval);
      const progress = Math.round((i / steps) * 100);
      const chars = Math.round((i / steps) * 20);
      const progressBar = '[' + '#'.repeat(chars) + '.'.repeat(20 - chars) + ']';
      
      // Update the last line (the progress bar)
      this.updateLastHistory(`${progressBar} ${progress}%`);
    }

    await this.delay(400);
    this.addHistory('Download complete. Opening file...', 'system');
    
    window.open(RESUME_URL, '_blank');
    this.isProcessing.set(false);
    
    // Refocus input
    setTimeout(() => this.terminalInput?.nativeElement?.focus(), 100);
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
