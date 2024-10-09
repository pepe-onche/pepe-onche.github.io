<script lang="ts">
import { onMount } from "svelte";
let avatars = ['rire','jesus','magalax','mickey','zidane','fatigue','pepe','chat'];
export let avatar: string|null;

onMount(() => {
  avatar = avatars[Math.floor(Math.random()*(avatars.length-1))]
})
</script>

<div class="flex flex-wrap">
	{#each avatars as a}
	  <div class="w-1/4 p-2">
	    <button class="rounded-full overflow-hidden border-2 {avatar === a ? 'border-white' : 'border-transparent'}" on:click={() => avatar = a}><img src={"avatars/"+a+".png"} alt={a}></button>
	  </div>
  {/each}
</div>
