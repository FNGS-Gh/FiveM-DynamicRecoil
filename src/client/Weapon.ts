import { WpHash } from './utils';

export class Weapon {
  readonly group: number;
  readonly fireRate: number;

  constructor(readonly hash: number) {
    this.group = GetWeapontypeGroup(hash);
    this.fireRate = GetWeaponTimeBetweenShots(hash);
  }

  static get unarmed(): Weapon {
    return new Weapon(GetHashKey(WpHash.Unarmed));
  }
}