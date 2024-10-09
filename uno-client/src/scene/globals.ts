import { Assets, type Texture } from "pixi.js";
import type { Hand } from "./hand";
import { Scene } from "./scene";

export const cardWidth = 90;
export const cardHeight = 143.18;

export const self = {
  id: ''
};

export const scene = new Scene();
export let cardTexturesLoaded = false;
export const cardTextures: Record<string, Texture|null> = {
  back: null,
  red: null,
  green: null,
  blue: null,
  yellow: null,
  wild: null,
  draw_two: null,
  skip: null,
  reverse: null,
  wild_inner: null,
  wild_icon: null,
}
export const hands: Record<string, Hand> = {};
export const screen: Record<string, boolean> = {
  isMobile: false,
  isHorizontal: false
}
export const colors: Record<string, string> = {
  red: '#e41212',
  green: '#13e412',
  blue: '#1274e4',
  yellow: '#ffe600',
  wild: '#141414',
}

export const actions = {};

export async function loadCardAssets() {
  if (cardTexturesLoaded) return;

  for (const textureName of Object.keys(cardTextures)) {
    cardTextures[textureName] = await Assets.load('cards/'+textureName+'.png');
  }
  cardTexturesLoaded = true;
}
