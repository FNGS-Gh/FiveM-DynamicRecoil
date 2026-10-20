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
    if (!this.firearm) return;

    let amplifier = 1.0;

    if (IsPedInAnyVehicle(this.ped, false)) {
      const vehicle = GetVehiclePedIsUsing(this.ped);
      amplifier += 0.75;

      if (GetEntitySpeed(vehicle) > 2.5)
        amplifier += 1.0;
      
      if (this.ped === GetPedInVehicleSeat(vehicle, -1))
        amplifier += 1.5;
    } else {
      if (GetPedStealthMovement(this.ped))
        amplifier -= 0.1;

      if (!IsPlayerFreeAiming(this.player))
        amplifier += 1.0;

      if (IsPedWalking(this.ped))
        amplifier += 0.5;
      else if (IsPedRunning(this.ped))
        amplifier += 0.75;
    }

    this.firearm.amplifier = amplifier;
  }
}

const Recoil = new RecoilHandler;

on('playerSpawned', () => {
  if (!Recoil.tickThread) {
    Recoil.tickThread = true;
    setTick(() => {
      Recoil.checkShooting();
      Recoil.checkMovement();
    });
  }

  if (Recoil.interval) clearInterval(Recoil.interval);
  
  Recoil.interval = setInterval(() => {
    Recoil.checkWeapon();
    //Recoil.checkMovement();
  }, 250);
});

on('Recoil:ApplyAmplifier', (amplifier: number) => {
  Recoil.amplifier = amplifier;
});