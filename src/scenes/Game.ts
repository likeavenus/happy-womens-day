import Phaser from "phaser";
import Preloader from "./Preload";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { getDialog, greetings } from "./constants";
import { createLizardAnims } from "../characters/lizard-example/lizardAnims";
import Rope from "../containers/rope";
import Paused from "./Paused";
// import Lizard from "../characters/lizard/lizard";
import Menu from "./Menu";
import Fish from "../characters/fish";
import WaterBodyPlugin from "../containers/waterbodyPlugin";
import WaterBody from "../containers/waterBody";
import Girl from "../characters/girl/girl";
import MovingPlatform from "../containers/MovingPlatform";
import { TextBox } from "../containers/TextBox";
import Bat from "../characters/bat/bat";
import Chest from "../characters/chest/chest";

const MIN = Phaser.Math.DegToRad(-180);

class Game extends Phaser.Scene {
  hook!: Phaser.Physics.Matter.Image;
  lineGroup!: Phaser.Physics.Matter.Image[];
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  stars!: Phaser.Physics.Arcade.Group;
  platform!: MovingPlatform;
  platform2!: MovingPlatform;
  platform3!: MovingPlatform;

  chest!: Chest;
  starsSummary = 0;
  lizard!: Phaser.Physics.Matter.Sprite;
  isTouchingGround = false;
  level: number = 1;
  loadNextLevel: boolean = false;
  showDialog: boolean = false;
  dialog: any;
  fish!: Phaser.Physics.Matter.Image;
  dialogLevel: number = 0;
  emitter = new Phaser.Events.EventEmitter();
  water!: Phaser.Physics.Matter.Image;
  stick!: Phaser.Physics.Matter.Sprite;
  music!:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

  private backgrounds: {
    ratioX: number;
    ratioY: number;

    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];
  private velocityX = 10;
  collisionCategory1 = 0b0001;
  collisionCategory2 = 0b0010;
  collisionCategory3 = 0b0100;
  collisionCategory4 = 0b1000;
  collisionWaterCategory = 0b0101;

  constructor() {
    super("Game");
  }
  preload() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  create() {
    // this.platform.moveHorizontally(); bug

    /** music */
    this.sound.pauseOnBlur = false;
    this.music = this.sound.add("music", {
      volume: 0.2,
      loop: true,
    });
    if (!this.sound.locked) {
      // already unlocked so play
      this.music.play();
    } else {
      // wait for 'unlocked' to fire and then play
      this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        this.music.play();
      });
    }
    this.game.events.on(Phaser.Core.Events.BLUR, () => {
      console.log("blur event");

      // this.handleLoseFocus();
    });

    document.addEventListener("visibilitychange", () => {
      console.log("visibilitychange");

      if (!document.hidden) {
        return;
      }

      // this.handleLoseFocus();
    });
    /** music end */

    this.tweener = {
      x: MIN,
    };
    createLizardAnims(this.anims);
    this.GROUND_COLLISION_GROUP = this.matter.world.nextCategory();

    const nameFromStorage = localStorage.getItem("happyName");
    const startCoords = {
      x: 550,
      y: 1945,
    };

    const testCoords = {
      x: 2400,
      y: 1300,
    };
    enum GirlsSpriteKeys {
      Ksenia = "ksenia",
      Elena = "elena",
    }
    const girlKey = localStorage.getItem("girlKey");
    // const girlsMap = {
    //   [GirlsSpriteKeys.Ksenia]:
    // };
    this.lizard = new Girl(
      this,
      startCoords.x,
      startCoords.y,
      girlKey as string,
      nameFromStorage as string,
      {
        label: "girl",
      }
    );

    this.platform = new MovingPlatform(
      this,
      2450,
      2000,
      "platform",
      {}
    ).setPipeline("Light2D");
    this.platform2 = new MovingPlatform(
      this,
      3000,
      1200,
      "platform",
      {}
    ).setPipeline("Light2D");
    this.platform3 = new MovingPlatform(
      this,
      4000,
      1200,
      "platform",
      {}
    ).setPipeline("Light2D");
    this.chest = new Chest(
      this,
      this.platform3.x + 30,
      this.platform3.y - 40,
      "chest"
    );

    this.platform.moveVertically(2200);
    this.platform2.moveHorizontally(2000, -700);
    // this.cameras.main.zoomTo(0.4);

    this.lizard.setCollisionCategory(this.collisionCategory1);
    this.lizard.setCollidesWith(
      this.collisionCategory1 |
        this.collisionCategory2 |
        this.collisionCategory4
    );

    this.lizard.items = [];
    this.lizard.itemInArm = null;
    // this.lizard.setMass(140);

    // this.bat = new Bat(this, 660, 2500, "bat", undefined);

    this.input.on("pointerdown", (pointer) => {});

    const eKey = this.input.keyboard?.addKey("E");
    // eKey?.on("down", (e) => {
    //
    // });

    const space = this.input.keyboard.addKey("space");

    space.on("down", () => {});

    this.matter.add.mouseSpring();

    this.cameras.main.startFollow(this.lizard);

    const { width, height } = this.scale;
    const darknessMask = this.add.graphics();
    darknessMask.fillStyle(0x000000, 1);

    this.backgrounds.push(
      {
        ratioX: 0.07,
        ratioY: 0.009,
        sprite: this.add
          .tileSprite(0, 0, width, height, "background_1")
          .setOrigin(0, 0)
          .setScrollFactor(0, 0)
          .setScale(3.5, 4),
        // .setDepth(0),
      },
      {
        ratioX: 0.09,
        ratioY: 0.02,
        sprite: this.add
          .tileSprite(0, -120, width, height, "background_2")
          .setOrigin(0, 0)
          .setScrollFactor(0, 0)
          .setScale(3.5, 4),
        // .setDepth(0),
      }
    );

    this.backgrounds.forEach((tileSprite) => {
      darknessMask.fillRect(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height
      );
      // tileSprite.sprite.setMask(darknessMask.createGeometryMask());
    });

    const map = this.make.tilemap({ key: "happy-ground-tilemap" });
    const tileset = map.addTilesetImage(
      "ground", // имя в json файле
      "happy-ground"
    ) as Phaser.Tilemaps.Tileset;
    const groundLayer = map.createLayer("ground", tileset);
    groundLayer?.setName("ground");
    groundLayer?.setPipeline("Light2D");
    groundLayer?.setCollisionByProperty({ collides: true });
    groundLayer?.setCollisionCategory(this.collisionCategory2);
    groundLayer?.setCollidesWith(
      this.collisionCategory1 |
        this.collisionCategory3 |
        this.collisionCategory4
    );

    // groundLayer2?.setName("ground");
    // groundLayer3?.setName("ground");

    // groundLayer2.setPipeline("Light2D");
    // groundLayer3.setPipeline("Light2D");

    const debugLayer = this.add.graphics();
    // groundLayer2?.setCollisionCategory(GROUND_COLLISION_GROUP);
    // groundLayer3?.setCollisionCategory(GROUND_COLLISION_GROUP);

    // groundLayer2?.setCollisionByProperty({ collides: true });
    // groundLayer3?.setCollisionByProperty({ collides: true });
    // groundLayer2?.setCollisionCategory(this.collisionCategory2);
    // groundLayer2?.setCollidesWith(
    //   this.collisionCategory1 |
    //     this.collisionCategory3 |
    //     this.collisionCategory4
    // );

    // groundLayer3?.setCollisionCategory(this.collisionCategory2);
    // groundLayer3?.setCollidesWith(
    //   this.collisionCategory1 |
    //     this.collisionCategory3 |
    //     this.collisionCategory4
    // );

    // this.matter.world.convertTilemapLayer(groundLayer2);
    // this.matter.world.convertTilemapLayer(groundLayer3);
    this.matter.world.convertTilemapLayer(
      groundLayer as Phaser.Tilemaps.TilemapLayer
    );

    this.matter.world.on("collisionend", (e, bodyA, bodyB) => {
      if (
        e.pairs.some(
          (pair) => pair.bodyA.label == "water" && pair.bodyB.label == "hook"
        )
      ) {
        // this.rod.at(-2).inWater = false;
      }
    });

    this.matter.world.on("collisionstart", (e, bodyA, bodyB) => {
      if (
        (bodyA === this.lizard.body && bodyB === this.chest.body) ||
        (bodyA === this.chest.body && bodyB === this.lizard.body)
      ) {
        this.chest.openChest();
        let textBox;
        const greetings = localStorage.getItem("greetings") as string;
        if (!textBox) {
          let textBox = new TextBox(
            this,
            this.chest.x,
            this.chest.y - 200,
            400,
            260,
            greetings
          );

          this.tweens.add({
            targets: textBox,
            alpha: 1,
            ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0, // -1: infinity
            yoyo: false,
          });
        }
      }

      if (
        e.pairs.some(
          (pair) => pair.bodyA.label == "lizard" && pair.bodyB.label == "water"
        )
      ) {
        // console.log(
        //   e.pairs.filter((pair) => {
        //     console.log(pair);
        //   })
        // );
        // if (
        //   e.pairs.some(
        //     (pair) => pair.bodyA.label == "water" && pair.bodyB.label == "hook"
        //   )
        // ) {
        //   const i = this.waterBody.columns.findIndex(
        //     (col, i) => col.x + 370 >= bodyB.position.x && i
        //   );

        //   const speed = bodyB.speed * 3;
        //   const numDroplets = Math.ceil(bodyB.speed) * 6;

        //   // bodyB.setFrictionAir(0.25);
        //   this.waterBody.splash(
        //     Phaser.Math.Clamp(i, 0, this.waterBody.columns.length - 1),
        //     speed,
        //     numDroplets
        //   );
        // }
        const i = this.waterBody.columns.findIndex(
          (col, i) => col.x + 370 >= bodyA.position.x && i
        );

        const speed = bodyA.speed * 2;
        const numDroplets = Math.ceil(bodyA.speed) * 5;
        this.lizard.setFrictionAir(0.25);
        this.waterBody.splash(
          Phaser.Math.Clamp(i, 0, this.waterBody.columns.length - 1),
          speed,
          numDroplets
        );
      }
    });

    this.matter.world.on("collisionactive", (e, bodyA, bodyB) => {
      // if (
      //   (bodyA === this.platform2.body && bodyB === this.lizard.body) ||
      //   (bodyA === this.lizard.body && bodyB === this.platform2.body)
      // ) {
      //   console.log("hmmmmmm", this.platform2.getVelocity().x);
      //   // this.lizard.setVelocity(
      //   //   this.platform2.getVelocity().x,
      //   //   this.platform2.getVelocity().y
      //   // );
      //   // this.lizard.setVelocityX(this.platform2.getVelocity().x);
      // }
      if (
        e.pairs.some(
          (pair) => pair.bodyA.label == "water" && pair.bodyB.label == "hook"
        )
      ) {
        this.rod.at(-2).inWater = true;
        // this.rod.at(-2).setFrictionAir(0.25);
      }

      if (
        e.pairs.some(
          (pair) => pair.bodyA.label == "lizard" && pair.bodyB.label == "hook"
        )
      ) {
        // this.lizard.itemInArm = ;
        console.log("Поймал крючок");
        // this.rod.at(-2).copyPosition({
        //   x: this.lizard.x + 30,
        //   y: this.lizard.y,
        // });
        // this.lizard.items.push()
      }

      // if( e.pairs.some (pair => pair.bodyA.label == 'enemy' && pair.bodyB.label =='floor' )) {
      //     text += '\ne: touch floor';
      // }
    });

    // dungeonLayer?.setCollisionByProperty({ collides: true });
    // groundLayer2?.renderDebug(debugLayer, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    // });

    // this.tweens.add({
    //   targets: this.boy,
    //   // scaleX: 2,
    //   // scaleY: 2,
    //   alpha: 0,
    //   ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
    //   duration: 1000,
    //   repeat: 0, // -1: infinity
    //   yoyo: false,
    // });

    // this.starsText = this.add
    //   .text(60, 30, `Worms: ${this.starsSummary}`, {
    //     fontSize: "24px",
    //     fontFamily: "Arial",
    //     color: "#ffffff",
    //   })
    //   .setScrollFactor(0);

    this.emitter.on("lizard-dead", ({ x, y }: { x: number; y: number }) => {
      for (let i = 0; i < 20; i++) {
        this.stars.create(x, y, "star");
      }

      // this.starsText.setText(`Worms: ${this.starsSummary}`);
    });

    this.lights.enable();
    // setTimeout(() => {
    //   this.lights.setAmbientColor(0xf00ff);
    // }, 1000);
    this.lights.setAmbientColor(0x808080);

    this.events.on("resume", () => {});
    this.light = this.lights
      .addLight(this.lizard.x, this.lizard.y, 512)
      .setIntensity(2);

    // const lizard = this.physics.add.sprite(256, 500, "lizard").setScale(3.5);
    // const lizards = this.physics.add.group({
    //   classType: Lizard,
    //   runChildUpdate: true,
    //   createCallback: (go) => {
    //     (go as Lizard).initEmitter(this.emitter);
    //     (go as Lizard).body.onCollide = true;
    //   },
    // });

    // lizards.create(600, 1500, "lizard");
    // lizards.create(700, 2000, "lizard");
    // lizards.create(300, 1000, "lizard");

    // this.physics.add.collider(lizards, groundLayer2);
    // this.physics.add.collider(lizards, groundLayer3);
    this.matter.world.update60Hz();

    this.cameras.main.setFollowOffset(-30, 80);

    // this.rope = new Rope(this, this.lizard.x, this.lizard.y - 50, 500, 10);
  }

  update(time: number, delta: number) {
    for (let i = 0; i < this.backgrounds.length; ++i) {
      const bg = this.backgrounds[i];
      if (bg.sprite) {
        bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX;
        // bg.sprite.tilePositionY = this.cameras.main.scrollY * bg.ratioY;
      }
    }
    // this.starsText.setText(`Worms: ${this.starsSummary}`);

    this.light.x = this.lizard.x;
    this.light.y = this.lizard.y;

    const { left, right, up, space } = this.cursors;
    const speed = 5;
    this.lizard.update(this.cursors);
    // this.bat.update(time, this.lizard);
  }

  collectStar(player, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    if (star?.alpha === 1) {
      star!.disableBody(true, false);
      this.tweens.add({
        targets: star,
        x: -5000,
        y: -2000,
        ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 3000,
        repeat: 0, // -1: infinity
        yoyo: false,
      });

      setTimeout(() => {
        this.starsSummary += 5;
      }, 500);

      setTimeout(() => {
        star!.disableBody(true, true);
        this.scene.remove(star);
      }, 2000);
    }
  }
  punchStar(body, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    // star!.disableBody(true, true);
  }

  punchLizard(
    body,
    lizards?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  ) {}
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  fps: {
    limit: 140,
  },
  // width: window.innerWidth,
  // height: window.innerHeight,
  width: 1000,
  height: 600,
  scale: {
    mode: Phaser.Scale.MAX_ZOOM,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
    matter: {
      // debug: true,
      gravity: {
        y: 1,
      },
    },
  },
  scene: [Preloader, Menu, Game],
  plugins: {
    global: [
      {
        key: "WaterBodyPlugin",
        mapping: "waterplugin",
        plugin: WaterBodyPlugin,
        start: true,
      },
    ],
    scene: [
      {
        key: "rexUI",
        plugin: UIPlugin,
        mapping: "rexUI",
      },
    ],
  },
};

export const game = new Phaser.Game(config);
