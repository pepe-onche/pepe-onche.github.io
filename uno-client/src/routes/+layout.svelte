<script lang="ts">
	import '../app.postcss';
	import { initializeStores, Toast, storePopup, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import LeftMenu from "../leftMenu.svelte";

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	{#if $drawerStore.id === 'left-menu'}
    <LeftMenu on:openHelp={() => drawerStore.close()}></LeftMenu>
	{/if}
</Drawer>

<Toast />

<div class="flex flex-col h-full w-full">
	<div class="w-full h-full">
		<slot />
	</div>
</div>
