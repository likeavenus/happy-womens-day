import Phaser from "phaser";
import { greetings } from "./constants";
import { TextBox } from "../containers/TextBox";

export const GIRLS = [
  { name: "Ксения Ротозей", greetings: greetings.ksenia.text, key: "ksenia" },
  { name: "Анна Величко", greetings: greetings.anna.text, key: "anna" },
  {
    name: "Наталья Поветкина",
    greetings: greetings.nataliaP.text,
    key: "natalia_p",
  },
  {
    name: "Анастасия Петросян",
    greetings: greetings.nastya.text,
    key: "nastya",
  },
  {
    name: "Наталья Войлошникова",
    greetings: greetings.nataliaV.text,
    key: "natalia_v",
  },
  { name: "Елена Никифорова", greetings: greetings.elena.text, key: "elena" },
];

const CIRCLE_RADIUS = 240;

export default class Menu extends Phaser.Scene {
  window!: Phaser.GameObjects.Rectangle;
  text!: Phaser.GameObjects.Text;
  state: string = "none";
  constructor() {
    super("Menu");
  }

  create() {
    const xStart = 100;
    const yStart = 100;
    const spacing = 160;
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // let textBox = new TextBox(this, 600, 300, 400, 260, greetings.ksenia.text);
    this.cards = [];

    GIRLS.forEach((girl, i) => {
      const angle = (i / GIRLS.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * CIRCLE_RADIUS;
      const y = centerY + Math.sin(angle) * CIRCLE_RADIUS;
      const card = this.add.rectangle(x, y, spacing + 50, 100, 0xffffff, 1);

      card.setInteractive();
      card.on("pointerdown", () => {
        localStorage.setItem("girlKey", girl.key);
        localStorage.setItem("greetings", girl.greetings);
        this.startGame();
      });

      const emitter = this.add.particles(0, 0, "flare", {
        speed: 24,
        lifespan: 1500,
        quantity: 5,
        scale: { start: 0.4, end: 0 },
        emitting: false,
        emitZone: { type: "edge", source: card.getBounds(), quantity: 42 },
        duration: 200,
      });

      card.on("pointerover", () => {
        emitter.start();
      });

      const text = this.add.text(
        card.x - card.width / 2 + 16,
        card.y,
        girl.name,
        {
          color: "pink",
        }
      );

      this.cards.push(card);
    });

    // this.startGame();
    // const name = localStorage.getItem("happyName");
    // if (name) {
    //   this.startGame();
    // } else {
    //   const promptName = prompt("Как вас зовут?") as string;
    //   console.log("promptName: ", promptName);
    //   localStorage.setItem("happyName", promptName);
    //   this.startGame();
    // }
  }

  startGame = () => {
    this.scene.start("Game");
  };
}
