import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  window!: Phaser.GameObjects.Rectangle;
  text!: Phaser.GameObjects.Text;
  state: string = "none";
  constructor() {
    super("Menu");
  }

  create() {
    const name = localStorage.getItem("happyName");

    if (name) {
      this.startGame();
    } else {
      const promptName = prompt("Как вас зовут?") as string;
      console.log("promptName: ", promptName);
      localStorage.setItem("happyName", promptName);
      this.startGame();
    }
  }

  startGame = () => {
    this.scene.start("Game");
  };
}
