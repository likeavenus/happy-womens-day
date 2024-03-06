import Phaser from "phaser";
import { createLizardAnims } from "../lizard-example/lizardAnims";
import { createKseniaAnims } from "./anims";

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class Girl extends Phaser.Physics.Matter.Sprite {
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

    this.flipX = true;

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
    this.text.setDepth(11).setAlpha(0);

    const textFx = this.text.postFX.addGlow(0xffffff, 6, 0, false, 0.1, 24);
    this.setRectangle(27, 55);
    this.setOrigin(0.5, 0.56);
    console.log(this);

    this.setScale(2);
    this.setFixedRotation();
    this.setDepth(7);
    this.scene.add.existing(this);
    createKseniaAnims(this.scene.anims);
    this.anims.play("ksenia_idle");

    this.setOnCollide((data: MatterJS.ICollisionPair) => {
      this.isTouchingGround = true;
    });

    // const timer = this.scene.time.addEvent({
    //   delay: 1500, // ms
    //   callback: () => {
    //     this.text.alpha = 0;
    //   },
    // });

    // const emitter = this.scene.add.particles(0, 0, "flare", {
    //   speed: 24,
    //   lifespan: 1500,
    //   quantity: 10,
    //   scale: { start: 0.4, end: 0 },
    //   emitting: false,
    //   emitZone: { type: "edge", source: this.getBounds(), quantity: 42 },
    //   duration: 500,
    // });

    // emitter.start(2000);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    const { left, right, up, space } = cursors;
    const speed = 4;
    if (!this.isTouchingGround && this.body.velocity.y < 0) {
      this.anims.play("ksenia_jump", true);
      if (right.isDown) {
        this.setVelocityX(speed);
        this.flipX = true;
      } else if (left.isDown) {
        this.setVelocityX(-speed);
        this.flipX = false;
      }
    } else if (!this.isTouchingGround && this.body.velocity.y > 0) {
      this.anims.play("ksenia_down", true);
      if (right.isDown) {
        this.setVelocityX(speed);
        this.flipX = true;
      } else if (left.isDown) {
        this.setVelocityX(-speed);
        this.flipX = false;
      }
    } else if (left.isDown) {
      this.setVelocityX(-speed);
      this.flipX = false;
      this.anims.play("ksenia_run", true);
    } else if (right.isDown) {
      this.setVelocityX(speed);
      this.flipX = true;
      this.anims.play("ksenia_run", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("ksenia_idle", true);
    }

    const jumpSpeed = 17;

    if (Phaser.Input.Keyboard.JustDown(up) && this.isTouchingGround) {
      this.setVelocityY(-jumpSpeed);
      this.isTouchingGround = false;
    }

    this.text.copyPosition({
      x: this.x,
      y: this.y - 60,
    });
  }
}
