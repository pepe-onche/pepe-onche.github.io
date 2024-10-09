import type { GameObject } from "./gameObject";
import { Container } from "pixi.js";
import { actions, scene } from "./globals";
import { CardBack } from "./card";

export class Deck extends Container implements GameObject {
  deckSize: number;
  constructor(deckSize) {
    super();
    this.deckSize = deckSize;

    const card = new CardBack(0, 0, 0);
    this.interactive = true;
    this.cursor = 'pointer';

    this.update();

    this.on('click', () => {
      actions.drawCard();
    });
    this.addChild(card);
    scene.app.stage.addChild(this);
  }

  setDeckSize(deckSize: number) {
    this.deckSize = deckSize;
  }

  update() {
    if (!this.position) return;

    this.x = scene.width/2 - 150;
    this.y = scene.height/2;
    this.alpha = this.deckSize <= 0 ? 0 : 1;
  }
}

