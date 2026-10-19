import { LevelPayload } from './utils';
import { Firearm } from './Firearm';
import { Burst } from './Burst';
import { PlayerInfo } from './Player';

class RecoilHandler extends PlayerInfo {
  private still = false;
  private stealth = false;
  private running = false;
  private sprinting = false;
  private aiming = false;

  firearm: Firearm | null = null;

  amplifier = 1.0;

  interval: NodeJS.Timeout | null = null;
  tickThread = false;

  private setWeapon(hash: number) {
    this.firearm = new Firearm(hash, this.amplifier);
    Burst.applyFirearm(this.firearm.fireRate);
    this.firearm.applyBurst(Burst.tokensUsed);
  }

  checkWeapon() {
    const [armed, hash] = GetCurrentPedWeapon(this.ped, true);

    if (!armed || !IsPedArmed(this.ped, 4)) {
      this.firearm = null;
      return;
    }

    if (this.firearm?.hash !== hash) this.setWeapon(hash);
  }

  checkShooting() {
    if (this.firearm) {
      if (IsPedShooting(this.ped))
        this.firearm.applyBurst(Burst.useToken());
      else if (
        this.firearm.burstRate !== 0
        && !IsControlPressed(0, 24)
      ) this.firearm.applyBurst(Burst.tokensUsed);
    }
  }

  checkMovement() {

  }
}

const Recoil = new RecoilHandler;

on('playerSpawned', () => {
  if (!Recoil.tickThread) {
    Recoil.tickThread = true;
    setTick(() => {
      Recoil.checkShooting();
    });
  }

  if (Recoil.interval) clearInterval(Recoil.interval);
  
  Recoil.interval = setInterval(() => {
    Recoil.checkWeapon();
  }, 250);
});

on('Recoil:ApplyAmplifier', (amplifier: number) => {
  Recoil.amplifier = amplifier;
});