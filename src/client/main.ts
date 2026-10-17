import { Config } from './config';
import { ValidatePed } from './utils';
import { Weapon } from './Weapon';

class PedInfo {
  private _id = PlayerPedId();
  private _interval: NodeJS.Timeout | null = null;

  tickThread = false;
  player = PlayerId();
  weapon = Weapon.unarmed;

  constructor(
    private readonly canRoll: boolean,
    private readonly canHipFire: boolean,
  ) {}

  get id() {
    return this._id;
  }

  @ValidatePed()
  set id(ped: number) {
    this._id = ped;
  }

  get interval(): NodeJS.Timeout | null {
    return this._interval;
  }

  set interval(interval: NodeJS.Timeout) {
    if (this._interval) clearInterval(interval);
    else this._interval = interval;
  }

  checkWeapon() {
    const hash = GetCurrentPedWeapon(this.id);
    if (this.weapon.hash !== hash)
      this.weapon = new Weapon(hash);
  }

  checkMovement() {

  }
}

const Ped = new PedInfo(
  Config.canRoll,
  Config.canHipFire
);

on('playerSpawned', () => {
  Ped.player = PlayerId();
  Ped.id = PlayerPedId();

  if (!Ped.tickThread) {
    Ped.tickThread = true;
    setTick(() => {

    });
  }

  Ped.interval = setInterval(() => {
    Ped.checkWeapon();
  }, 250);
});

on('PedChanged', (ped: number) => {
  Ped.id = ped;
});