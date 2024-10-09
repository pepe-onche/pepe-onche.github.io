<script lang="ts">
import { getDrawerStore } from "@skeletonlabs/skeleton";
import type { DrawerSettings } from "@skeletonlabs/skeleton";
import { gameState } from "./stores/colyseus";
import Help from "./help.svelte";
import LeftMenu from "./leftMenu.svelte";
import Table from "./table.svelte";
import { isHelpOpen } from "./stores/store";

const leftDrawerSettings: DrawerSettings = { id: 'left-menu' };
const drawerStore = getDrawerStore();
</script>

{#if $gameState}
  <div class="w-screen h-full flex">
    <div class="md:w-1/3 lg:w-1/4 hidden md:block">
      <LeftMenu></LeftMenu>
    </div>
    <div class="w-full md:w-2/3 lg:w-3/4 relative flex justify-around items-center">
      <Table></Table>
      {#if $isHelpOpen}
        <div class="absolute top-0 left-0 w-full h-full p-4 flex flex-col items-center justify-center"><Help></Help></div>
      {/if}
    </div>
    <button on:click={() => drawerStore.open(leftDrawerSettings)} type="button" class="md:hidden btn-icon btn-icon-lg variant-filled rounded-lg absolute bottom-0 left-0 ml-2 mb-2" style="box-shadow: 0 0 18px rgba(0,0,0,0.5);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
        <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 0 0-.266.112L8.78 21.53A.75.75 0 0 1 7.5 21v-3.955a48.842 48.842 0 0 1-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
{/if}
