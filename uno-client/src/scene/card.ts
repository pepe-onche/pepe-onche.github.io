import { Graphics, Sprite, Text, TextStyle } from "pixi.js";

import type { GameObject } from "./gameObject";
import { actions, cardHeight, cardTextures, cardWidth, colors, hands, scene, self } from "./globals";

export interface CardData {
  color: string,
  value: string,
}

export class CardFront extends Sprite implements GameObject {
  constructor(x, y, angle, color, value, interactive = false) {
    super(cardTextures[color]);
    this.anchor.set(0.5, 0.5);
    this.width = cardWidth;
    this.height = cardHeight;

    const bigShadowDistance = cardTextures[color].height/35;
    const smallShadowDistance = cardTextures[color].height/70;

    let text;

    if (value === 'draw_two') text = '+2';
    else if (value === 'draw_four') text = '+4';
    else text = value.toString()[0];

    let img;
    if (value === 'wild' || value === 'draw_four') {
      const sprite = new Sprite(cardTextures['wild_inner']);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      sprite.scale = 1;
      this.addChild(sprite);
    } 

    let bigText;
    if (value === 'wild') {
      img = cardTextures['wild_icon'];
    } else if (value === 'draw_two' || value === 'draw_four') {
      const sprite = new Sprite(cardTextures['draw_two']);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      sprite.scale = 1.3;
      this.addChild(sprite);
    } else if (value === 'skip') {
      img = cardTextures['skip'];
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      sprite.scale = 2;
      this.addChild(sprite);
    } else if (value === 'reverse') {
      img = cardTextures['reverse'];
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      sprite.scale = 2;
      this.addChild(sprite);
    } else if (value !== 'wild') {
      const bigStyle = new TextStyle({
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: cardTextures[color].height/3,
        fill: '#ffffff',
        align: 'center',
        stroke: {
          width: cardTextures[color].height/30,
          color: '#000000'
        },
        dropShadow: {
          angle: Math.PI/4,
          distance: bigShadowDistance,
          color: '#000000'
        },
      });
      bigText = new Text({ text, style: bigStyle });
      bigText.anchor.set(0.5, 0.5);
      bigText.x = 0;
      bigText.y = 0;
      this.addChild(bigText);
    }

    // Draw bar under number
    if (bigText && (value == 6 || value == 9)) {
      const bigBar = new Graphics()
      .rect(
        -bigText.width/2-10 + bigShadowDistance/2,
        bigText.height/3 + bigShadowDistance/2,
        bigText.width,
        bigText.height/16,
      )
      .stroke({
        color: '#000000',
        width: cardTextures[color].height/40,
      })
      .fill('#000000')
      .rect(
        -bigText.width/2-10,
        bigText.height/3,
        bigText.width,
        bigText.height/16,
      )
      .stroke({
        color: '#000000',
        width: cardTextures[color].height/40,
      })
      .fill('#ffffff');
      this.addChild(bigBar);
    }

    if (img) {
      const smallSprite = new Sprite(img);
      smallSprite.scale = 1;
      smallSprite.x = -cardTextures[color].width/2+65;
      smallSprite.y = -cardTextures[color].height/2+65;
      const smallSpriteReversed = new Sprite(img);
      smallSpriteReversed.scale = 1;
      smallSpriteReversed.x = cardTextures[color].width/2-65;
      smallSpriteReversed.y = cardTextures[color].height/2-65;
      smallSpriteReversed.rotation = Math.PI;
      this.addChild(smallSprite);
      this.addChild(smallSpriteReversed);
    } else {
      const smallStyle = new TextStyle({
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: cardTextures[color].height/7,
        fill: '#ffffff',
        align: 'center',
        stroke: {
          width: cardTextures[color].height/60,
          color: '#000000'
        },
        dropShadow: {
          angle: Math.PI/4,
          distance: smallShadowDistance,
          color: '#000000'
        },
      });
      const smallText = new Text({ text, style: smallStyle });
      smallText.x = 60-cardTextures[color].width/2;
      smallText.y = 40-cardTextures[color].height/2;
      this.addChild(smallText);

      const smallTextReversed = new Text({ text, style: smallStyle });
      smallTextReversed.rotation = Math.PI;
      smallTextReversed.x = -60+cardTextures[color].width/2; // Center in the card
      smallTextReversed.y = -40+cardTextures[color].height/2; // Center in the card
      this.addChild(smallTextReversed);

      if (bigText && (value == 6 || value == 9)) {
        const smallBar = new Graphics()
        .rect(
          65-cardTextures[color].width/2 + smallShadowDistance/2,
          40-cardTextures[color].height/2+smallText.height/1.2 + smallShadowDistance/2,
          smallText.width/1.2,
          smallText.height/16,
        )
        .stroke({
          color: '#000000',
          width: cardTextures[color].height/60,
        })
        .fill('#000000')
        .rect(
          65-cardTextures[color].width/2,
          40-cardTextures[color].height/2+smallText.height/1.2,
          smallText.width/1.2,
          smallText.height/16,
        )
        .stroke({
          color: '#000000',
          width: cardTextures[color].height/60,
        })
        .fill('#ffffff');

        const smallBar2 = smallBar.clone();
        smallBar2.rotation = Math.PI;

        this.addChild(smallBar);
        this.addChild(smallBar2);
      }
    }

    this.x = x;
    this.y = y;
    this.rotation = angle;

    if (interactive) {
      this.interactive = true;
      this.cursor = 'pointer';

      this.on('mouseover', () => {
        const cardIndex = scene.players.get(self.id).hand.cards.findIndex(c => c === this);
        scene.players.get(self.id).hand.setFocus(cardIndex);
        scene.players.get(self.id).hand.update();
      });
      this.on('mouseout', () => {
        scene.players.get(self.id).hand.setFocus(null);
        scene.players.get(self.id).hand.update();
      });
      this.on('click', () => {
        const cardIndex = scene.players.get(self.id).hand.cards.findIndex(c => c === this);

        if (cardIndex >= 0) {
          if (color === 'wild') actions.preplayWild(cardIndex);
          else actions.playCard(cardIndex);
        }
      });
    }
  }

  update() {
  }
}

export class CardBack extends Sprite implements GameObject {
  constructor(x, y, angle) {
    super(cardTextures.back);
    this.width = cardWidth;
    this.height = cardHeight;
    this.anchor.set(0.5, 0.5);
    this.x = x;
    this.y = y;
    this.rotation = angle;
  }
  update() {
  }
}
