import Phaser from "phaser";
import { createBatAnims } from "../characters/bat/createBatAnims";
import Sol from "../characters/sol/sol";

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class Bat extends Phaser.Physics.Matter.Sprite {
  private direction = Direction.RIGHT;
  public hp = 100;
  angle = 0;
  circleRadius = 40;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene.matter.world, x, y, texture, frame, {
      label: "bat",
    });
    this.setScale(0.8);
    this.setFixedRotation();
    this.setDepth(7);
    this.setIgnoreGravity(true);
    this.scene.add.existing(this);
    createBatAnims(this.scene.anims);
    this.anims.play("bat-move");
    this.setPipeline("Light2D");

    this.setCollisionCategory(0);
  }

  update(time: number, player: Sol): void {
    this.x = this.circleRadius * Math.cos(this.angle) + player.x + 40;
    this.y = this.circleRadius * Math.sin(this.angle) + player.y - 40;

    this.flipX = player.flipX;

    if (this.flipX) {
      this.angle -= 0.02;
    } else {
      this.angle += 0.02;
    }
  }
}
