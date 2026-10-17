export enum Level {
  NONE      = 1 << 0,
  AMATEUR   = 1 << 1,
  ADVANCED  = 1 << 2,
  PRO       = 1 << 3,
}

export const RECOIL_AMP_MAP: Record<Level, number> = {
  [Level.NONE]:     2.5,
  [Level.AMATEUR]:  1.75,
  [Level.ADVANCED]: 1.5,
  [Level.PRO]:      1.25,
};