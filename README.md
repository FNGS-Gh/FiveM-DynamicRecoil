# FiveM-DynamicRecoil
`by Ghost @ FNGS / 2026` → [Author's GitHub](https://github.com/GhostQck) / [Publish Github](https://github.com/FNGS-Gh)

This standalone script implements dynamic firearm recoil based on the player actions. For example, the longer the shooting burst lasts, the bigger the recoil will be. Altnernatively, recoil while running is bigger than while standing completely still.

*More details can be found below under the* **"2. Description"** *section ▼*

## 1. Installation
❗️ *This project is published under the MIT License. Upon using it, please make sure to keep the credits and apply the same type of licensing.*

---

###
If you don't care about the code readability and you just want to deploy the resource straight away, you can delete everything except of the following files and folders (and their content respectively):

```
fxmanifest.lua
config.json
dist/
```

The `config.json` file can be modified anytime with no need to rebuild the scripts.

---

###
If you want to modify the code, you'll find the source TypeScript files within the `src/` folder. Please note that this repo doesn't contain any TS builder and etc, so you'll need to set up your dev environment accordingly. Additionally, I want to mention that I use decorators here, so the `tsconfig` setup needs to support them too.

Also make sure that you have the `@citizenfx` packages:

```
npm install -D typescript @citizenfx/client @citizenfx/server
```

## 2. Description

The script utilizes multiple systems to handle dynamic recoil. First of all, it keeps track of a token based burst counter, which refills every `750ms` by default. The more burst tokens are spent, the bigger the recoil will be. Secondly, the script checks player actual movement to adjust the extra recoil amplifier based on the movement intensity. And lastly, it also implements a recoil for when the player shoots out of the vehicle, which is absent in the vanilla game.

### Client Events (inbound):

`Recoil:ApplyAmplifier` - can be executed from another resource to apply custom recoil amplifier for an individual player.

`Recoil:ApplyAmplifier` argument:\
• `amplifier`: `number` - the amplifier value `[0, ∞)`.

## 3. Known Issues

*None at the moment*