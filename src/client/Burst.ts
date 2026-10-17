import { Firearm } from './Firearm';
import { TokensMs } from './utils';

class BurstHandler {
  private tokensMax = 0;
  private tokens = 0;
  private usageCdMs = 0;
  private lastUsage = 0;

  private refillTimer: NodeJS.Timeout | null = null;

  private scheduleRefill() {
    if (this.refillTimer) return;
        
    this.refillTimer = setTimeout(() => {
      if (this.refillTimer) {
        clearTimeout(this.refillTimer);
        this.refillTimer = null;
      }

      this.tokens++;

      console.log(`Token refilled: ${this.tokens}`);

      if (this.tokens < this.tokensMax)
        this.scheduleRefill();
    }, TokensMs.REFILL);
  }

  applyFirearm(firearm: Firearm) {
    const tokenRatio = this.tokens / this.tokensMax;

    this.tokensMax = Math.floor(5 / firearm.fireRate);

    if (Number.isNaN(tokenRatio)) {
      this.tokens = this.tokensMax;
      if (this.refillTimer) {
        clearTimeout(this.refillTimer);
        this.refillTimer = null;
      }
    } else this.tokens = Math.floor(this.tokensMax * tokenRatio);

    this.usageCdMs = Math.floor(firearm.fireRate * 1250);

    console.log(
      `Token Ratio: ${tokenRatio}`,
      `Burst: ${this.tokensMax}`,
      `UsageCdMs: ${this.usageCdMs}`
    );
  }

  useToken() {
    const now = GetGameTimer();
    
    if (
      now - this.lastUsage < this.usageCdMs
      || this.tokens <= 0
    ) return;

    this.lastUsage = now;
    this.tokens--;

    console.log(`Token used: ${this.tokens}`);

    this.scheduleRefill();
  }
}

export const Burst = new BurstHandler;