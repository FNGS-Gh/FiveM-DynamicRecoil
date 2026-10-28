const ValidatePed = (argIdx = 0) => {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const initMethod = descriptor.set || descriptor.value;

    if (!initMethod) return;

    const fn = function (this: any, ...args: any[]) {
      const entity = args[argIdx];

      if (typeof entity !== 'number' || !IsEntityAPed(entity))
        args[argIdx] = PlayerPedId();

      return initMethod.apply(this, args);
    };

    if (descriptor.set) descriptor.set = fn;
    else descriptor.value = fn;

    return descriptor;
  };
};

export abstract class PlayerInfo {
  private _ped = 0;

  player = 0;

  constructor() {
    on('playerSpawned', () => {
      this.player = PlayerId();
      this.ped = PlayerPedId();
    });

    on('PedChanged', (ped: number) => { // Edit 'PedChanged' to whatever client event handles player's ped change
      this.ped = ped;
    });
  }

  get ped(): number {
    return this._ped;
  }

  @ValidatePed()
  set ped(ped: number) {
    this._ped = ped;
  }
}