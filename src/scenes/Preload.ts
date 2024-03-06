import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    /** Tiles */

    this.load.image("happy-ground", "assets/happy/happy.png");
    this.load.tilemapTiledJSON(
      "happy-ground-tilemap",
      "assets/happy/happy-ground.json"
    );

    this.load.image("background_1", "assets/happy/background_layer_1.png");
    this.load.image("background_2", "assets/happy/background_layer_2.png");
    this.load.image("background_3", "assets/happy/background_layer_3.png");
    this.load.image("platform", "assets/happy/objects/platform.png");

    /** Atlases */
    this.load.atlas(
      "lizard",
      "assets/lizard/lizard.png",
      "assets/lizard/lizard.json"
    );
    this.load.atlas("bat", "assets/branch/bat.png", "assets/branch/bat.json");
    /** girls */
    this.load.atlas(
      "ksenia",
      "assets/happy/girls/Ksenia/ksenia_idle.png",
      "assets/happy/girls/Ksenia/ksenia_idle.json"
    );

    this.load.atlas(
      "ksenia_run",
      "assets/happy/girls/Ksenia/ksenia_run.png",
      "assets/happy/girls/Ksenia/ksenia_run.json"
    );

    this.load.atlas(
      "ksenia_jump",
      "assets/happy/girls/Ksenia/ksenia_jump.png",
      "assets/happy/girls/Ksenia/ksenia_jump.json"
    );

    this.load.atlas(
      "ksenia_down",
      "assets/happy/girls/Ksenia/ksenia_down.png",
      "assets/happy/girls/Ksenia/ksenia_down.json"
    );

    /** Images */
    this.load.image("star", "assets/star.png");

    this.load.image("flare", "assets/happy/white-flare.png");

    this.load.audio(
      "music",
      "assets/happy/scott-buckley-reverie(chosic.com).mp3"
    );
  }

  create() {
    // this.scene.start("Game");
    this.scene.start("Menu");
  }
}
