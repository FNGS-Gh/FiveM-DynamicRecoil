import { LevelPayload, TokensMs, ValidatePed } from './utils';
import { Firearm } from './Firearm';
import { Burst } from './Burst';

class PedInfo {
  private _id = PlayerPedId();

  player = PlayerId();
  firearm: Firearm | null = null;

  amplifier = 1.0;
  dropHeavy = false;
  dropOnBlind = false;

  interval: NodeJS.Timeout | null = null;
  tickThread = false;

  get id() {
    return this._id;
  }

  @ValidatePed()
  set id(ped: number) {
    this._id = ped;
  }

  private setWeapon(hash: number) {
    this.firearm = new Firearm(hash);
    Burst.applyFirearm(this.firearm);
  }

  checkWeapon() {
    const [armed, hash] = GetCurrentPedWeapon(this.id, true);

    if (!armed || !IsPedArmed(this.id, 4)) {
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

const Ped = new PedInfo;

on('playerSpawned', () => {
  Ped.player = PlayerId();
  Ped.id = PlayerPedId();

  if (!Ped.tickThread) {
    Ped.tickThread = true;
    setTick(() => {
      if (Ped.firearm && IsPedShooting(Ped.id))
        Burst.useToken();
    });
  }

  if (Ped.interval) clearInterval(Ped.interval);
  
  Ped.interval = setInterval(() => {
    Ped.checkWeapon();
  }, 250);
});

on('PedChanged', (ped: number) => {
  Ped.id = ped;
});

on('Recoil:ApplyLevel', (payload: LevelPayload) => {
  Ped.amplifier = payload.amplifier;
  Ped.dropHeavy = payload.dropHeavy;
  Ped.dropOnBlind = payload.dropOnBlind;
});