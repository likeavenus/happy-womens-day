import Phaser from "phaser";

export default class Intro extends Phaser.Scene {
  constructor() {
    super("intro");
  }

  preload() {
    this.load.image("phaser-logo", "assets/happy/phaser-logo.png");
  }

  create() {
    const phaserImage = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      "phaser-logo"
    );

    const introText = this.add.text(
      phaserImage.x / 2 + phaserImage.width / 4,
      phaserImage.y / 2 - 70,
      "Powered by"
    );

    phaserImage.setScale(0.5);
    phaserImage.alpha = 0;

    introText.alpha = 0;

    this.tweens.add({
      targets: [phaserImage, introText],
      alpha: 1,
      ease: "linear", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 800,
      onComplete: () => {
        this.tweens.add({
          targets: [phaserImage, introText],
          alpha: 0,
          ease: "linear",
          duration: 800,
          delay: 2200,
          onComplete: () => {
            this.scene.start("preloader");
          },
        });
      },
    });
  }
}
