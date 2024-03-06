import Phaser from "phaser";

export const createKseniaAnims = (
  anims: Phaser.Animations.AnimationManager
) => {
  anims.create({
    key: "ksenia_idle",
    frames: anims.generateFrameNames("ksenia", {
      start: 0,
      end: 4,
      prefix: "ksenia_idle",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 10,
  });

  anims.create({
    key: "ksenia_run",
    frames: anims.generateFrameNames("ksenia_run", {
      start: 0,
      end: 7,
      prefix: "ksenia_run",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 10,
  });

  anims.create({
    key: "ksenia_jump",
    frames: anims.generateFrameNames("ksenia_jump", {
      start: 0,
      end: 3,
      prefix: "Char1_Jump-Up",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 20,
  });

  anims.create({
    key: "ksenia_down",
    frames: anims.generateFrameNames("ksenia_down", {
      start: 0,
      end: 3,
      prefix: "Char1_Jump-Down",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 20,
  });
};
