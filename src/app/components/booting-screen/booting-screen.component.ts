import { Component, EventEmitter, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booting-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] bg-background flex flex-col font-mono p-4 sm:p-12 overflow-hidden pointer-events-none transition-opacity duration-1000"
         [class.opacity-0]="isFinished()">
      
      <!-- CRT Overlay -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.03] z-[101] overflow-hidden">
        <div class="absolute inset-0 bg-repeat bg-[length:100%_4px] bg-gradient-to-b from-transparent via-foreground to-transparent animate-scanline"></div>
      </div>

      <div class="max-w-3xl mx-auto w-full space-y-1">
        @for (log of visibleLogs(); track $index) {
          <div class="flex gap-4">
            <span class="text-muted-foreground break-keep shrink-0">[{{ log.timestamp }}]</span>
            <span [class]="log.type === 'error' ? 'text-destructive' : log.type === 'success' ? 'text-accent' : 'text-foreground'">
              {{ log.message }}
            </span>
          </div>
        }
        
        @if (!isFinished()) {
          <div class="flex items-center gap-2 mt-4 text-accent animate-pulse font-bold tracking-widest border-t border-accent/20 pt-4">
            <span class="inline-block w-4 h-4 bg-accent animate-ping rounded-full shrink-0"></span>
            INITIALIZING SYSTEM... {{ progressValue() }}%
          </div>
        }
      </div>

      <div class="absolute bottom-12 right-12 text-muted-foreground/30 text-xs hidden sm:block uppercase tracking-widest">
        NaderOS v21.0.4-LTS / Kernel: 6.12.0-rc3
      </div>
    </div>
  `,
  styles: [`
    @keyframes scanline {
      from { transform: translateY(-100%); }
      to { transform: translateY(100%); }
    }
    .animate-scanline {
      animation: scanline 8s linear infinite;
    }
  `]
})
export class BootingScreenComponent implements OnInit {
  @Output() completed = new EventEmitter<void>();
  
  private logs = [
    { message: "BOOTING_KERNEL: NaderOS System Environment", type: "info" },
    { message: "LOADING_DRIVERS: GPU, HID, USB, NET_STACK", type: "info" },
    { message: "NETWORK: Pinging DNS 8.8.8.8...", type: "info" },
    { message: "NETWORK: Connection established (lat: 2ms)", type: "success" },
    { message: "SECURITY: Decrypting portfolio layer...", type: "info" },
    { message: "SECURITY: RSA Keys validated.", type: "success" },
    { message: "HYDRATING: Restoring Signal-based state...", type: "info" },
    { message: "SUCCESS: Environment ready.", type: "success" },
    { message: "LAUNCHING: User Interface [v1.0.4]", type: "info" }
  ];

  visibleLogs = signal<{message: string, timestamp: string, type: string}[]>([]);
  progressValue = signal(0);
  isFinished = signal(false);

  ngOnInit() {
    this.runBootSequence();
  }

  async runBootSequence() {
    for (let i = 0; i < this.logs.length; i++) {
      const log = this.logs[i];
      const stamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
      
      await this.delay(Math.random() * 200 + 100);
      this.visibleLogs.update(prev => [...prev, { ...log, timestamp: stamp }]);
      this.progressValue.set(Math.round(((i + 1) / this.logs.length) * 100));
    }

    await this.delay(600);
    this.isFinished.set(true);
    
    await this.delay(1000); // Wait for transition
    this.completed.emit();
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
