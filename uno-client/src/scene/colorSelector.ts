import type { GameObject } from "./gameObject";
import { Container, Graphics } from "pixi.js";
import { actions, colors, scene } from "./globals";

export class ColorSelector extends Container implements GameObject {
  cardIndex: number;

  constructor(cardIndex: number) {
    super();
    this.cardIndex = cardIndex;

    const colorRadius = 25;
    const offset = 15;

    Object.keys(colors).filter(c => c !== 'wild').map((color: string, i: number, allColors: string[]) => {
      const g = new Graphics()
        .circle(colorRadius, colorRadius, colorRadius)
        .fill({ color: colors[color] })

      g.pivot.set(colorRadius, colorRadius);
      g.x = - (colorRadius*2*(allColors.length-1) + offset*(allColors.length-1))/2 + (colorRadius*2*i + offset*i);
      g.y = 0;
      g.alpha = 0.8;

      g.interactive = true;
      g.cursor = 'pointer';

      g.on('mouseover', () => {
        g.alpha = 1;
        g.scale.set(1.2, 1.2);
      });
      g.on('mouseout', () => {
        g.alpha = 0.8;
        g.scale.set(1, 1);
      });

      g.on('click', () => {
        actions.playCard(this.cardIndex, color);
        this.close();
      });

      this.addChild(g);

      return g;
    });

    this.update();
    scene.app.stage.addChild(this);
  }

  update() {
    this.x = scene.width/2;
    this.y = scene.height/2+130;
  }

  close() {
    this.destroy();
  }
}

