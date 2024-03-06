import Phaser from "phaser";

export const createBatAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "bat-move",
    frames: anims.generateFrameNames("bat", {
      start: 1,
      end: 4,
      prefix: "bat",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 10,
  });
};
