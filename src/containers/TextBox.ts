import Phaser from "phaser";

export class TextBox extends Phaser.GameObjects.Container {
  private rectangle: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;
  paper!: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ) {
    super(scene, x, y);

    // this.paper = this.scene.add.image(x, y, "paper");
    this.paper = new Phaser.GameObjects.Image(scene, 0, 0, "paper");
    this.paper.setScale(1.1, 0.5);
    this.add(this.paper);

    // Создание белого прямоугольника
    // this.rectangle = new Phaser.GameObjects.Rectangle(
    //   scene,
    //   0,
    //   0,
    //   width,
    //   height,
    //   0xffffff
    // );
    // this.rectangle.setStrokeStyle(2, 0x000000);
    // this.add(this.rectangle);
    this.setSize(width, height);

    // Создание текста с отступом от границ прямоугольника
    this.text = new Phaser.GameObjects.Text(scene, this.x, this.y, text, {
      color: "#000000",
      wordWrap: { width: width - 16 },
      fontSize: 28,
    });
    this.add(this.text);

    // Расположение текста в центре прямоугольника
    this.text.setPosition(
      this.width / 2 - width + 16,
      this.height / 2 - this.height + 16
    );

    this.setDepth(6);
    this.alpha = 0;

    scene.add.existing(this);
  }
}
