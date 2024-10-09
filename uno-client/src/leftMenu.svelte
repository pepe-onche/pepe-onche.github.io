<script lang="ts">
import ButtonBar from "./buttonBar.svelte";
import Chat from "./chat.svelte";
import Players from './players.svelte';
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col card rounded-nonei w-full h-full">
  <div class="h-auto z-40">
    <ButtonBar on:openHelp={() => dispatch('openHelp')}></ButtonBar>
  </div>
  <div class="h-auto">
    <Players></Players>
  </div>
  <Chat></Chat>
</div>
