import { LevelPayload } from './utils';
import { Firearm } from './Firearm';
import { Burst } from './Burst';
import { PlayerInfo } from './Player';

class RecoilHandler extends PlayerInfo {
  firearm: Firearm | null = null;

  amplifier = 1.0;
  dropHeavy = false;
  dropOnBlind = false;

  interval: NodeJS.Timeout | null = null;
  tickThread = false;

  private setWeapon(hash: number) {
    this.firearm = new Firearm(hash, this.amplifier);
    Burst.applyFirearm(this.firearm.fireRate);
  }

  checkWeapon() {
    const [armed, hash] = GetCurrentPedWeapon(this.ped, true);

    if (!armed || !IsPedArmed(this.ped, 4)) {
      this.firearm = null;
      return;
    }

    if (this.firearm?.hash !== hash) this.setWeapon(hash);
  }

  checkMovement() {

  }

  restrict() {

  }
}

const Recoil = new RecoilHandler;

on('playerSpawned', () => {
  if (!Recoil.tickThread) {
    Recoil.tickThread = true;
    setTick(() => {
      if (Recoil.firearm && IsPedShooting(Recoil.ped))
        Burst.useToken();
    });
  }

  if (Recoil.interval) clearInterval(Recoil.interval);
  
  Recoil.interval = setInterval(() => {
    Recoil.checkWeapon();
  }, 250);
});

on('Recoil:ApplyLevel', (payload: LevelPayload) => {
  Recoil.amplifier = payload.amplifier;
  Recoil.dropHeavy = payload.dropHeavy;
  Recoil.dropOnBlind = payload.dropOnBlind;
});