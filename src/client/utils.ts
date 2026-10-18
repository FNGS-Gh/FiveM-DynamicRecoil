export enum WpHash {
  Unarmed = 'WEAPON_UNARMED'
}

export enum Tokens {
  MAX = 10,
  REFILL_MS = 1500
}

export interface LevelPayload {
  amplifier: number;
  dropHeavy: boolean;
  dropOnBlind: boolean;
}