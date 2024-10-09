import { Container, Graphics, type TickerCallback } from "pixi.js";

import type { GameObject } from "./gameObject";
import { scene, screen, self } from "./globals";
import { Hand } from "./hand";
import type { CardData } from "./card";

export interface PlayerData {
  id: string;
  handSize: number;
  avatar: string;
}

export class Player extends Container implements GameObject {
  id: string;
  hand: Hand;
  avatarName: string;
  avatar: Container;
  timer: Graphics;
  tickerFn: TickerCallback<this>|undefined;

  constructor(data: PlayerData, handSize: number, cardsData: CardData[]|null) {
    super();
    this.id = data.id;
    this.hand = new Hand(this.id, handSize, cardsData||null);
    this.timer = new Graphics();
    this.addChild(this.timer);
    this.avatarName = data.avatar;
    this.avatar = this.createAvatar();

    this.addChild(this.hand);
    scene.mainContainer.addChild(this);
  }

  createAvatar(): Container {
    const avatar = new Graphics()
      .rect(0, 0, scene.assets[this.avatarName].width, scene.assets[this.avatarName].height)
      .fill({ color: '#120b18' })
      .texture(scene.assets[this.avatarName]);

    avatar.width = 100;
    avatar.height = 100;

    const mask = new Graphics()
      .roundRect(0, 0, avatar.width, avatar.height, avatar.width/2)
      .fill({ color: '#ffffff' });

    mask.x = avatar.x;
    mask.y = avatar.y;
    avatar.mask = mask;

    const avatarGroup = new Container();
    avatarGroup.addChild(mask);
    avatarGroup.addChild(avatar);
    avatarGroup.pivot.set(avatar.width/2, avatar.height/2);
    this.addChild(avatarGroup);
    return avatarGroup;
  }

  getPosition() {
    const selfOffset = screen.isMobile ? -100 : 60;
    const offset = screen.isMobile ? -150 : 60;

    let orderedPlayersArray;
    if (scene.playerIds.includes(self.id)) {
      const selfIndex = scene.playerIds.findIndex(p => p === self.id);
      orderedPlayersArray = scene.playerIds.slice(selfIndex, scene.playerIds.length).concat(scene.playerIds.slice(0, selfIndex));
    } else {
      orderedPlayersArray = scene.playerIds;
    }
    const playerI = orderedPlayersArray.findIndex(p => p === this.id);
    const defaultPos = {
      x: 0,
      y: 0,
    }
    if (playerI === 0) return {
      x: scene.width/2,
      y: scene.height-selfOffset
    }

    switch (scene.players.size) {
      case 2:
        return {
          x: scene.width/2,
          y: offset
        }
      case 3:
        if (playerI === 1) return {
          x: offset,
          y: offset
        }
        if (playerI === 2) return {
          x: scene.width-offset,
          y: offset
        }
        return defaultPos;
      case 4:
        if (playerI === 1) return {
          x: offset,
          y: scene.height/2
        }
        if (playerI === 2) return {
          x: scene.width/2,
          y: offset
        }
        if (playerI === 3) return {
          x: scene.width-offset,
          y: scene.height/2
        }
        return defaultPos;
      case 5:
        if (screen.isMobile && !screen.isHorizontal) {
          if (playerI === 1) return {
            x: offset,
            y: scene.height * (3/5)
          }
          if (playerI === 2) return {
            x: offset+60,
            y: offset+60
          }
          if (playerI === 3) return {
            x: scene.width-offset-60,
            y: offset+60
          }
          if (playerI === 4) return {
            x: scene.width-offset,
            y: scene.height * (3/5)
          }
        }
        if (playerI === 1) return {
          x: offset,
          y: scene.height * (3/5)
        }
        if (playerI === 2) return {
          x: offset,
          y: offset
        }
        if (playerI === 3) return {
          x: scene.width-offset,
          y: offset
        }
        if (playerI === 4) return {
          x: scene.width-offset,
          y: scene.height * (3/5)
        }
        return defaultPos;
      case 6:
        if (screen.isMobile && !screen.isHorizontal) {
          if (playerI === 1) return {
            x: offset,
            y: scene.height * (3/4)
          }
          if (playerI === 2) return {
            x: offset,
            y: scene.height * (1/6)
          }
          if (playerI === 3) return {
            x: scene.width/2,
            y: offset
          }
          if (playerI === 4) return {
            x: scene.width-offset,
            y: scene.height * (1/6)
          }
          if (playerI === 5) return {
            x: scene.width-offset,
            y: scene.height * (3/4)
          }
        }
        if (playerI === 1) return {
          x: offset,
          y: scene.height * (2/3)
        }
        if (playerI === 2) return {
          x: offset,
          y: offset
        }
        if (playerI === 3) return {
          x: scene.width/2,
          y: offset
        }
        if (playerI === 4) return {
          x: scene.width-offset,
          y: offset
        }
        if (playerI === 5) return {
          x: scene.width-offset,
          y: scene.height * (2/3)
        }
        return defaultPos;

      default:
        return defaultPos;
    }

  }
  getAngle() {
    const playerIndex = scene.playerIds.findIndex(p => p === this.id);
    const selfIndex = scene.playerIds.includes(self.id) ? scene.playerIds.findIndex(p => p === self.id) : 0;
    return 2*Math.PI/scene.players.size*playerIndex-2*Math.PI/scene.players.size*selfIndex+Math.PI/2;
  }

  startTimer(startTime: number) {
    this.tickerFn = () => {
      const radius = this.avatar.width/2+5;
      const pos = this.avatar.position;

      const startAngle = -Math.PI/2;
      const progress = Math.min((Date.now()-startTime)/30000, 1);
      this.timer.clear();

      if (progress >= 1 && this.tickerFn) return scene.app.ticker.remove(this.tickerFn);

      const endAngle = startAngle+Math.PI*2*(1-progress);

      this.timer.beginFill('#ffffff');
      this.timer.moveTo(pos.x, pos.y);
      this.timer.arc(pos.x, pos.y, radius, startAngle, endAngle);
      this.timer.lineTo(pos.x, pos.y);
      this.timer.endFill();
    }
    scene.app.ticker.add(this.tickerFn);
  }
  stopTimer() {
    this.timer.clear();
    if (this.tickerFn) scene.app.ticker.remove(this.tickerFn);
  }

  updateAvatar() {
    const pos = this.getPosition();
    const angle = this.getAngle();

    if (screen.isMobile) {
      this.avatar.width = 50;
      this.avatar.height = 50;
      const offset = this.id === self.id ? 20 : 0;
      this.avatar.x = pos.x-Math.cos(angle)*(260+offset);
      this.avatar.y = pos.y-Math.sin(angle)*(260+offset);
    } else {
      this.avatar.width = 100;
      this.avatar.height = 100;
      this.avatar.x = pos.x;
      this.avatar.y = pos.y;
    }
  }
  update(animate = true) {
    this.updateAvatar();
    this.hand.update(animate);
  }
}

