import type { GameObject } from "./gameObject";
import { Container, Graphics, Sprite, type TickerCallback } from "pixi.js";
import { scene } from "./globals";

export class Decoration extends Container implements GameObject {
  spiral: Sprite = new Sprite();
  spiralFn: TickerCallback<Sprite>;
  colorIndicator: Sprite = new Sprite();

  constructor() {
    super();

    this.spiralFn = ({ deltaTime }) => {
        this.spiral.rotation += (scene.reversed ? -0.003 : 0.003) * deltaTime;
    }

    this.initSpiral();
    this.initColorIndicator();

    this.update();
    scene.app.stage.addChild(this);
  }

  initSpiral() {
    this.spiral = new Sprite(scene.assets['spiral']);
    this.spiral.anchor.set(0.5, 0.5);

    this.addChild(this.spiral);

    scene.app.ticker.add(this.spiralFn);
  }
  initColorIndicator() {
    this.colorIndicator = new Sprite(scene.assets['radialgradient']);
    this.colorIndicator.width = 900;
    this.colorIndicator.height = 900;
    this.colorIndicator.anchor.set(0.5, 0.5);
    this.colorIndicator.alpha = 0.7;
    // this.colorIndicator.tint = '#120b18';
    this.addChild(this.colorIndicator);
  }

  setColor(color: string) {
    this.spiral.tint = color;
    this.colorIndicator.tint = color;
  }

  reset() {
    this.setColor('#ffffff');
  }

  update() {
    const max = Math.max(scene.width, scene.height);
    this.colorIndicator.x = scene.width/2;
    this.colorIndicator.y = scene.height/2;
    this.spiral.width = max*1.6;
    this.spiral.height = max*1.6;
    this.spiral.x = scene.width/2;
    this.spiral.y = scene.height/2;
  }
}


