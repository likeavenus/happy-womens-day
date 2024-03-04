import Phaser from "phaser";
import { createLizardAnims } from "../lizard-example/lizardAnims";

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class Sol extends Phaser.Physics.Matter.Sprite {
  private direction = Direction.RIGHT;
  public hp = 100;
  isTouchingGround = false;
  text!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    name: string,
    frame?: string | number
  ) {
    super(scene.matter.world, x, y, texture, frame, {
      label: "lizard",
      frictionAir: 0.006,
    });

    this.name = name;
    this.text = this.scene.add
      .text(this.x, this.y - 20, this.name, {
        color: "#3807c4",
        fontFamily: "Arial",
        fontStyle: "bold",
        fontSize: 22,
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    this.text.setDepth(11);

    const textFx = this.text.postFX.addGlow(0xffffff, 6, 0, false, 0.1, 24);

    this.setScale(3);
    this.setFixedRotation();
    this.setDepth(7);
    this.scene.add.existing(this);
    createLizardAnims(this.scene.anims);
    this.anims.play("lizard-idle");

    this.setOnCollide((data: MatterJS.ICollisionPair) => {
      this.isTouchingGround = true;
    });
  }

  attack() {}

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    const { left, right, up, space } = cursors;
    const speed = 4;
    if (left.isDown) {
      this.setVelocityX(-speed);
      this.flipX = true;
      this.anims.play("lizard-run", true);
    } else if (right.isDown) {
      this.setVelocityX(speed);
      this.flipX = false;
      this.anims.play("lizard-run", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("lizard-idle", true);
    }

    const jumpSpeed = 17;

    if (Phaser.Input.Keyboard.JustDown(up) && this.isTouchingGround) {
      this.setVelocityY(-jumpSpeed);
      this.isTouchingGround = false;
    }

    this.text.copyPosition({
      x: this.x + this.width,
      y: this.y - 30,
    });
  }
}
