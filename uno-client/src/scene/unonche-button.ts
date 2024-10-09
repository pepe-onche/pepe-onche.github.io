import { Graphics } from "pixi.js";
import type { GameObject } from "./gameObject";
import { actions, scene } from "./globals";

export class UnoncheButton extends Graphics implements GameObject {
  constructor() {
    super();
    const width = 100;
    const height = 100;

    this.beginFill(0xffffff); // White background
    this.lineStyle(2, 0x000000); // Black border
    this.drawRoundedRect(0, 0, width, height, 10);
    this.endFill();

    this.pivot.set(width/2, height/2);

    this.interactive = true;

    this.on('click', () => {
      actions.sayUno();
    });

    this.update();

    scene.app.stage.addChild(this);
  }

  update() {
    if (!this.position) return;

    this.position.x = scene.width/2+150;
    this.position.y = scene.height/2;
  }
}

