import Phaser from "phaser";
import { createChestAnims } from "./anims";

export default class Chest extends Phaser.Physics.Matter.Sprite {
  open = false;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene.matter.world, x, y, texture, frame, {
      label: "chest",
    });
    this.setScale(1.5);
    this.setStatic(true);
    this.setFixedRotation();
    this.setDepth(7);
    this.setIgnoreGravity(true);
    createChestAnims(this.scene.anims);

    this.scene.add.existing(this);
    // this.anims.play("bat-move");
    this.setPipeline("Light2D");
  }

  openChest() {
    this.open = true;
    console.log("open chest");
    this.anims.play("chest-open");
  }

  update(time: number): void {}
}
