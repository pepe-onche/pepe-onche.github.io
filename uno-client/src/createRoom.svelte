<script lang="ts">
import { createRoom } from "./stores/colyseus";
import AvatarSelector from "./avatarSelector.svelte";

let avatar: string|null;
let playerName = '';
$: allowed = playerName.length >= 3 && playerName.length <= 15;

function submit() {
  if (!allowed || !avatar) return;
  createRoom(playerName, avatar);
}
</script>

<div class="p-4 flex items-center justify-center w-full h-full">
  <div class="card max-w-md">
	  <header class="card-header font-bold text-center">Nouvelle partie</header>
	  <section class="p-4 pb-0"><input class="input" type="text" placeholder="Pseudo" bind:value={playerName} /></section>
	  <div class="mt-4 font-bold text-center">Avatar</div>
	  <div class="p-2"><AvatarSelector bind:avatar={avatar}></AvatarSelector></div>
	  <footer class="card-footer"><button type="button" class="btn w-full variant-filled" class:opacity-50={!allowed} class:cursor-not-allowed={!allowed} on:click={submit}>Créer la partie</button></footer>
  </div>
</div>
