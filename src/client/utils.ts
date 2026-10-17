export enum WpHash {
  Unarmed = 'WEAPON_UNARMED'
}

export const ValidatePed = (argIdx = 0) => {
  return function (
    _target: any,
    _propKey: string,
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