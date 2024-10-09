<script lang="ts">
import { Application } from "pixi.js";
import { onMount } from "svelte";
import { CardFront } from "./scene/card";
import { cardHeight, loadCardAssets, cardWidth } from "./scene/globals";
import { isHelpOpen } from "./stores/store";

let drawTwo:HTMLCanvasElement;
let reverse:HTMLCanvasElement;
let skip:HTMLCanvasElement;
let wild:HTMLCanvasElement;
let drawFour:HTMLCanvasElement;
let poc:HTMLCanvasElement;

const width = 60;
const height = width*(cardHeight/cardWidth);
const cards = [
  { color: 'yellow', value: 'draw_two' },
  { color: 'red', value: 'reverse' },
  { color: 'blue', value: 'skip' },
  { color: 'wild', value: 'wild' },
  { color: 'wild', value: 'draw_four' },
  { color: 'wild', value: 'poc' },
]

async function init() {
  const els: HTMLCanvasElement[] = [drawTwo, reverse, skip, wild, drawFour, poc];
  await loadCardAssets();
  for (let i = 0; i < els.length; i++) {
    const cardData = cards[i];
    const app = new Application();
    await app.init({ width, height, canvas: els[i], backgroundAlpha: 0 });
    const card = new CardFront(width/2, height/2, 0, cardData.color, cardData.value, false);
    card.width = width;
    card.height = height;
    app.stage.addChild(card);
  }
}
onMount(async () => {
  await init()
});
</script>

<div class="card w-full p-4 rounded-xl relative overflow-auto" style="max-width: 1000px; max-height: 100%;">
  <button on:click={() => $isHelpOpen = false} type="button" class="btn-icon btn-icon-sm variant-filled rounded-lg absolute top-0 right-0 mt-2 mr-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  </button>
  <h2 class="text-xl text-primary-500">Objectif du jeu</h2>
  <p>Pour gagner, vous devez être le 1er à vous débarrasser de toutes vos cartes.</p>
  <h2 class="text-xl text-primary-500 mt-2">Le principe</h2>
  <p>
    Les joueurs doivent recouvrir la dernière carte jouée par une carte :
  </p>
  <ul class="list-disc ml-4">
    <li>de <b>même couleur</b>,</li>
    <li>ou portant le <b>même numéro</b>,</li>
    <li>ou le <b>même symbole</b> que celle-ci.</li>
  </ul>
  <p>
    Lorsque qu’un joueur n’a plus qu’une carte en sa possession, il doit crier « Unonche! » pour avertir tous les autres joueurs. S’il oublie de le faire et qu’un joueur s’en aperçoit en criant « contre Unonche! », il devra piocher 2 cartes en pénalité.
  </p>
  <h2 class="text-xl text-primary-500 mt-2 mb-1">Cartes « Action »</h2>
  <div class="flex flex-wrap">
    <div class="flex mb-1 w-full md:w-2/4 items-center"><canvas {width} {height} bind:this={drawTwo} /><div class="flex flex-col justify-center ml-2"><b>Carte « +2 »</b>Le joueur suivant pioche deux cartes.</div></div>
    <div class="flex mb-1 w-full md:w-2/4 items-center"><canvas {width} {height} bind:this={reverse} /><div class="flex flex-col justify-center ml-2"><b>Carte « Changement de sens »</b>Inverse le sens du jeu.</div></div>
    <div class="flex mb-1 w-full md:w-2/4 items-center"><canvas {width} {height} bind:this={skip} /><div class="flex flex-col justify-center ml-2"><b>Carte « Passe ton tour »</b>Le joueur suivant passe son tour.</div></div>
    <div class="flex mb-1 w-full md:w-2/4 items-center"><canvas {width} {height} bind:this={wild} /><div class="flex flex-col justify-center ml-2"><b>Carte « Joker »</b>Le joueur peut changer de couleur.</div></div>
    <div class="flex mb-1 w-full md:w-2/4 items-center"><canvas {width} {height} bind:this={drawFour} /><div class="flex flex-col justify-center ml-2"><b>Carte « +4 »</b>Le joueur peut changer de couleur, et le joueur suivant pioche quatre cartes. Cette carte ne peut être jouée que si le joueur ne possède aucune carte de la couleur actuelle.</div></div>
    <div class="flex mb-1 w-full md:w-2/4 items-center"><canvas {width} {height} bind:this={poc} /><div class="flex flex-col justify-center ml-2"><b>Carte « Post ou cancer »</b>Les autres joueurs doivent poster un message dans les cinq secondes, sinon ils piochent deux cartes.</div></div>
  </div>
</div>
