import Phaser from "phaser";

export default class MovingPlatform extends Phaser.Physics.Matter.Image {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    options
  ) {
    super(scene.matter.world, x, y, texture, 0, options);

    scene.add.existing(this);
  }
}
