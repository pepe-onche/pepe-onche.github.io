import { Container } from "pixi.js";
import gsap from "gsap";

import type { GameObject } from "./gameObject";
import { scene, self } from "./globals";
import { CardBack, CardFront, type CardData } from "./card";

export class Hand extends Container implements GameObject {
  playerId: string;
  cards: Container[];
  focusIndex: number|null = null;

  constructor(playerId: string, cardsAmount: number, cardsData: CardData[]|null) {
    super();
    this.playerId = playerId;
    this.cards = [];

    for (let j = 0; j < cardsAmount; j++) {
      if (cardsData) {
        const data = cardsData[j];
        this.addCard(new CardFront(0, 0, 0, data.color, data.value, true));
      } else {
        this.addCard(new CardBack(0, 0, 0));
      }
    }
  }
  addCard(card: CardFront|CardBack) {
    this.cards.push(card);
    this.addChild(card);
    this.update();
  }
  setFocus(cardIndex: number|null) {
    this.focusIndex = cardIndex;
  }
  update(animate = true) {
    const player = scene.players.get(this.playerId);
    if (!player) return;
    const angle = player.getAngle();
    const playerPos = player.getPosition();
    const handX = playerPos.x-Math.cos(angle)*130;
    const handY = playerPos.y-Math.sin(angle)*130;
    const handAngle = angle+Math.PI/2;

    const rotation = angle-Math.PI/2;
    const cardsAmount = this.cards.length;
    const cardsOffset = 380/cardsAmount*(this.playerId === self.id ? 1 : 0.3);

    for (let j = 0; j < cardsAmount; j++) {
      const focus = this.focusIndex !== null ? (j < this.focusIndex ? 1 : (j > this.focusIndex ? -1 : 0)) : 0;
      const focusOffset = 40*focus;
      const focusOffsetUp = this.focusIndex === j ? 30 : 0;
      const arcOffset = (cardsAmount <= 1 ? 1 : (-(j/(cardsAmount-1)*2-1)*(j/(cardsAmount-1)*2-1)+1)) * (this.playerId === self.id ? 40 : 20);
      const x = handX-Math.cos(handAngle)*cardsOffset*j+Math.cos(handAngle)*cardsOffset*(cardsAmount-1)/2-Math.cos(angle)*arcOffset+Math.cos(handAngle)*focusOffset-Math.cos(angle)*focusOffsetUp;
      const y = handY-Math.sin(handAngle)*cardsOffset*j+Math.sin(handAngle)*cardsOffset*(cardsAmount-1)/2-Math.sin(angle)*arcOffset+Math.sin(handAngle)*focusOffset-Math.sin(angle)*focusOffsetUp;
      let cardAngleRelative = (j-(cardsAmount-1)/2)/10+0.001;
      if (cardAngleRelative < -0.5) cardAngleRelative = -0.5;
      if (cardAngleRelative > 0.5) cardAngleRelative = 0.5;
      const cardAngle = rotation+cardAngleRelative;
      const card = this.cards[j];
      if (animate) {
        gsap.to(card.position, {
          duration: 0.2,
          x, y,
          ease: "power1.inOut",
        });
        gsap.to(card, {
          duration: 0.2,
          rotation: cardAngle,
          ease: "power1.inOut",
        });
      } else {
        card.position.x = x;
        card.position.y = y;
        card.rotation = cardAngle;
      }
    }
  }
}
