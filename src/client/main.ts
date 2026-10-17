import { Level } from './config';
import { ValidatePed } from './utils';
import { Firearm } from './Firearm';

class PedInfo {
  private _id = PlayerPedId();

  player = PlayerId();
  firearm: Firearm | null = null;

  interval: NodeJS.Timeout | null = null;
  tickThread = false;

  constructor(public level: Level) {}

  get id() {
    return this._id;
  }

  @ValidatePed()
  set id(ped: number) {
    this._id = ped;
  }

  checkWeapon() {
    const [armed, hash] = GetCurrentPedWeapon(this.id, true);

    console.log(this.firearm);

    if (!armed || !IsPedArmed(this.id, 4)) {
      if (this.firearm) this.firearm = null;
      return;
    }

    if (this.firearm?.hash !== hash)
      this.firearm = new Firearm(hash);
  }

  checkMovement() {

  }

  restrict() {

  }
}

const Ped = new PedInfo(Level.NONE);

on('playerSpawned', () => {
  Ped.player = PlayerId();
  Ped.id = PlayerPedId();

  if (!Ped.tickThread) {
    Ped.tickThread = true;
    setTick(() => {

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