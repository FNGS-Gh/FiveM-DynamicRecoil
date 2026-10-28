import { Firearm } from './Firearm';
import { Burst } from './Burst';
import { PlayerInfo } from './Player';

class RecoilHandler extends PlayerInfo {
  private lastVehShot = 0;
  private inVehicle = false;

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
    if (!IsPlayerFreeAiming(this.player)) {
      DisablePlayerFiring(this.player, true);
      return;
    }

    if (IsPedShooting(this.ped))
      this.firearm!.applyBurst(Burst.useToken());
    else if (
      this.firearm!.burstRate !== 0
      && !IsControlPressed(0, 24)
    ) this.firearm!.applyBurst(Burst.tokensUsed);
  }

  checkVehicle() {
    if (IsPedInAnyVehicle(this.ped, false)) {
      if (!this.inVehicle) this.inVehicle = true;

      const now = GetGameTimer();

      if (!IsPedShooting(this.ped) || now - this.lastVehShot < 250)
        return;

      this.lastVehShot = now;

      const vehicle = GetVehiclePedIsUsing(this.ped);
      let shake = 1.75;

      if (GetEntitySpeed(vehicle) > 2.5)
        shake += 1.0;
      
      if (this.ped === GetPedInVehicleSeat(vehicle, -1))
        shake += 1.5;

      ShakeGameplayCam('CARBINE_RIFLE_RECOIL_SHAKE', shake);
    } else if (this.inVehicle) this.inVehicle = true;
  }

  checkMovement() {
    if (this.inVehicle) return;

    let amplifier = 1.0;

    if (GetPedStealthMovement(this.ped))
      amplifier -= 0.25;

    if (IsPedWalking(this.ped))
      amplifier += 0.5;
    else if (IsPedRunning(this.ped))
      amplifier += 0.75;

    this.firearm!.amplifier = amplifier;
  }
}

const Recoil = new RecoilHandler;

on('playerSpawned', () => {
  if (!Recoil.tickThread) {
    Recoil.tickThread = true;
    setTick(() => {
      if (!Recoil.firearm) return;

      Recoil.checkShooting();
      Recoil.checkVehicle();
    });
  }

  if (Recoil.interval) clearInterval(Recoil.interval);
  
  Recoil.interval = setInterval(() => {
    Recoil.checkWeapon();
    
    if (!Recoil.firearm) return;

    Recoil.checkMovement();
  }, 250);
});

on('Recoil:ApplyAmplifier', (amplifier: number) => {
  Recoil.amplifier = amplifier;
});