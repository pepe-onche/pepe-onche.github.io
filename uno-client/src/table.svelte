<script lang="ts">
import { onMount } from 'svelte';
import { getToastStore } from '@skeletonlabs/skeleton';
import { scene } from "./scene/globals";
import { room, gameState, addDefaultListeners, getNonSpectatorPlayers } from "./stores/colyseus";
import { isHelpOpen } from './stores/store';

let container:HTMLElement;
let el:HTMLCanvasElement;

const toastStore = getToastStore();

const actions = {
  playCard(cardIndex: number, nextColor: string = 'red') {
    $room.send("play_card", { cardIndex, nextColor });
  },
  drawCard() {
    $room.send("draw_card");
  },
  sayUno() {
    $room.send("say_uno");
  },
  preplayWild(cardIndex: number) {
    $room.send("preplay_wild", { cardIndex });
  },
  startGame() {
    $room.send("start");
  }
}

onMount(async () => {
  if (!$room) return;

  await scene.init(el, container, $room.sessionId, actions);
  $room.removeAllListeners();
  addDefaultListeners($room);

  $room.onLeave(() => {
		toastStore.trigger({
			message: 'Déconnecté de la partie',
			background: 'variant-filled-error',
		});
		gameState.set(null);
		room.set(null);
  });

  $room.onMessage("play_card", async (message) => {
    scene.onPlayCard(message.playerId, message.cardIndex, message.card, message.nextColor);
  });

  $room.onMessage("new_turn", (message) => {
    scene.onNewTurn(message.playerId, message.startTime);
  });

  $room.onMessage("choose_color", async (message) => {
    scene.onChooseColor(message.cardIndex);
  });

  $room.onMessage("draw", (message) => {
    scene.onDrawCard(message.playerId, message.card);
  });

  $room.onMessage("win", (message) => {
    scene.onWin(message.playerId, $gameState.players);
  });

  $room.onMessage("end", () => {
    scene.onEnd();
  });

  $room.onMessage("start", async (message) => {
    $isHelpOpen = false;
    await scene.start(getNonSpectatorPlayers(), message.cards, message.currentPlayerId, message.turnStartTime, message.deckSize);
  });

  $room.onMessage("players_update", async (message) => {
    if ($gameState.playing) scene.onPlayersUpdate(getNonSpectatorPlayers(message.players));
  });

  if ($gameState.playing) {
    await scene.start(getNonSpectatorPlayers(), $gameState.players.get($room.sessionId).hand, $gameState.currentPlayerId, $gameState.turnStartTime, $gameState.deckSize, $gameState.discardPile);
  }
});
</script>

<div bind:this={container} class="w-full h-full" style="max-height: 100%">
  <canvas bind:this={el} class="w-full h-full"></canvas>
</div>
{#if !$gameState.playing}
  <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
    <div class="p-4 flex flex-col items-center">
      <img src="logo.png" alt="logo" class="w-3/4 py-4 mb-4"/>
      <button class="btn variant-filled mb-2 w-full md:w-2/4" on:click={() => $isHelpOpen = true}>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </span>
        <span>Lire le guide</span>
      </button>
      {#if $room.sessionId === $gameState.kingPlayerId}
        {#if $gameState.players.size < 2}
          <span class="px-3 py-1 text-red-500 mb-2 font-bold bg-surface-900 rounded-md">Il faut au moins 2 joueurs pour commencer une partie</span>
        {:else}
          <button class="btn variant-filled w-full md:w-2/4" class:opacity-50={$gameState.players.size < 2} class:cursor-not-allowed={$gameState.players.size < 2} on:click={actions.startGame}>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
            </span>
            <span>Commencer la partie</span>
          </button>
        {/if}
      {/if}
    </div>
  </div>
{/if}
