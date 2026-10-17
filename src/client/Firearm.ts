export class Firearm {
  private readonly baseRecoil: number;

  readonly group: number;
  readonly fireRate: number;
  readonly recoil: number;

  constructor(readonly hash: number) {
    this.group = GetWeapontypeGroup(hash);
    this.fireRate = GetWeaponTimeBetweenShots(hash);
    this.baseRecoil = GetWeaponRecoilShakeAmplitude(hash);
    this.recoil = this.baseRecoil;

    console.log(
      `Group: ${this.group}`,
      `FireRate: ${this.fireRate}`,
      `Recoil: ${this.baseRecoil}`
    );
  }
}