<script lang="ts">
import { page } from '$app/stores';
import { getToastStore } from '@skeletonlabs/skeleton';
import { joinRoom } from "./stores/colyseus";
import AvatarSelector from "./avatarSelector.svelte";

let avatar: string|null;
let playerName = '';
$: roomId = $page.url.searchParams.get('room');

const toastStore = getToastStore();

$: allowed = /^[-_a-zA-Z0-9]{3,15}$/.test(playerName);

async function join() {
  if (!allowed || !roomId || !avatar) return;
	try {
		await joinRoom(roomId, playerName, avatar);
	} catch (e) {
		toastStore.trigger({
			message: e.message,
			background: 'variant-filled-error',
		});
	}
}
</script>

<div class="p-4 flex items-center justify-center w-full h-full">
	<div class="card max-w-md">
		<header class="card-header font-bold text-center">Rejoindre #{roomId}</header>
		<section class="p-4 pb-0"><input class="input" type="text" placeholder="Pseudo" bind:value={playerName} /></section>
	  <div class="mt-4 font-bold text-center">Avatar</div>
	  <div class="p-2"><AvatarSelector bind:avatar={avatar}></AvatarSelector></div>
		<footer class="card-footer"><button type="button" class="btn w-full variant-filled" class:opacity-50={!allowed} class:cursor-not-allowed={!allowed} on:click={join}>Rejoindre</button></footer>
	</div>
</div>
