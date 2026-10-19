export class Firearm {
  private static readonly recoilCache = new Map<number, number>;

  private readonly baseRecoil: number;
  private _recoil = 0;
  private _burstRate = 0;

  readonly group: number;
  readonly fireRate: number;

  constructor(readonly hash: number, amplifier: number = 1.0) {
    this.group = GetWeapontypeGroup(hash);
    this.fireRate = GetWeaponTimeBetweenShots(hash);

    let recoil = Firearm.recoilCache.get(hash);
    if (!recoil) {
      recoil = GetWeaponRecoilShakeAmplitude(hash);
      Firearm.recoilCache.set(hash, recoil);
    }

    this.baseRecoil = recoil * amplifier;
    this.recoil = this.baseRecoil;

    console.log(
      `Group: ${this.group}`,
      `FireRate: ${this.fireRate}`,
      `Recoil: ${this.baseRecoil}`
    );
  }

  private set recoil(recoil: number) {
    const normal = Math.max(0, recoil);

    if (this._recoil !== normal) {
      this._recoil = normal;
      SetWeaponRecoilShakeAmplitude(this.hash, normal);
      
      console.log(`Recoil: ${normal}`);
    }
  }

  private set burstRate(rate: number) {
    this._burstRate = rate;
  }

  get recoil(): number {
    return this._recoil;
  }

  get burstRate(): number {
    return this._burstRate;
  }

  amplifyRecoil(amplifier: number) {
    console.log(`Amplifier: ${amplifier}`);
    this.recoil *= amplifier;
  }

  applyBurst(rate: number) {
    if (this.burstRate === rate) return;

    this.burstRate = rate;

    const amplifier = 1.0 + rate * 0.1;
    this.recoil = this.baseRecoil * amplifier;
  }
}