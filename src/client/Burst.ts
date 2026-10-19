import { Tokens } from './utils';

class BurstHandler {
  private usageCdMs = 0;
  private lastUsage = 0;
  private lastAttempt = 0;

  private refillTimer: NodeJS.Timeout | null = null;

  private tokens = Tokens.MAX;

  get tokensUsed(): number {
    return Tokens.MAX - this.tokens;
  }

  private scheduleRefill() {
    if (this.refillTimer) return;
        
    this.refillTimer = setTimeout(() => {
      this.refillTimer = null;
      const timePassed = GetGameTimer() - this.lastAttempt;

      if (timePassed < Tokens.REFILL_MS) {
        this.scheduleRefill();
        return;
      }
    
      this.tokens++;

      console.log(`Token refilled: ${this.tokens}`);

      if (this.tokens < Tokens.MAX) this.scheduleRefill();
    }, Tokens.REFILL_MS);
  }

  applyFirearm(fireRate: number) {
    this.usageCdMs = Math.floor(100 / fireRate);
    console.log(`UsageCdMs: ${this.usageCdMs}`);
  }

  useToken(): number {
    const now = GetGameTimer();
    this.lastAttempt = now;
    
    if (
      now - this.lastUsage >= this.usageCdMs
      && this.tokens > 0
    ) {
      this.lastUsage = now;
      this.tokens--;

      console.log(`Token used: ${this.tokens}`);

      this.scheduleRefill();
    }

    return this.tokensUsed;
  }
}

export const Burst = new BurstHandler;