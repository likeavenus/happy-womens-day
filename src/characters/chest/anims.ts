import Phaser from "phaser";

export const createChestAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "chest-open",
    frames: anims.generateFrameNames("chest", {
      start: 20,
      end: 29,
      prefix: "Chests",
      suffix: ".png",
    }),
    // repeat: -1,
    frameRate: 10,
  });
};
