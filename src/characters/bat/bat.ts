import Phaser from "phaser";
import { createBatAnims } from "./createBatAnims";
import Girl from "../girl/girl";

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
    this.setScale(0.9);
    this.setFixedRotation();
    this.setDepth(7);
    this.setIgnoreGravity(true);
    this.scene.add.existing(this);
    createBatAnims(this.scene.anims);
    this.anims.play("bat-move");
    this.setPipeline("Light2D");

    this.setCollisionCategory(0);
  }

  update(time: number, player: Girl): void {
    this.x = this.circleRadius * Math.cos(this.angle) + player.x + 50;
    this.y = this.circleRadius * Math.sin(this.angle) + player.y - 70;

    this.flipX = !player.flipX;

    if (this.flipX) {
      this.angle -= 0.02;
    } else {
      this.angle += 0.02;
    }
  }
}
