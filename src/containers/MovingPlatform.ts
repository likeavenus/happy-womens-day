import Phaser from "phaser";

export default class MovingPlatform extends Phaser.Physics.Matter.Image {
  startY = 0;
  startX = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    options
  ) {
    super(scene.matter.world, x, y, texture, options);
    this.startX = x;
    this.startY = y;
    this.setStatic(true);
    this.setDepth(7);
    this.setFixedRotation();
    this.setFriction(1, 0, Infinity);
    this.setIgnoreGravity(true);
    this.scene.add.existing(this);
  }

  moveVertically(duration: number) {
    this.scene.tweens.addCounter({
      from: 0,
      to: -900,
      duration: duration,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const y = this.startY + target.value;
        const dy = y - this.y;
        this.y = y;
        this.setVelocityY(dy);
      },
    });
  }

  moveHorizontally(duration: number, to: number) {
    this.scene.tweens.addCounter({
      from: 0,
      to: -to,
      duration: duration,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const x = this.startX + target.value;
        const dx = x - this.x;
        this.x = x;
        this.setVelocityX(dx);
      },
    });
  }
}
