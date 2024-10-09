<script>
import { onMount, tick } from "svelte";
import { room, gameState, chatMessages } from "./stores/colyseus";
$: newMsg = '';

function sendMsg() {
  if (newMsg.trim().length === 0) return;
  $room.send("chat_msg", { text: newMsg.trim() });
  newMsg = '';
}
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    sendMsg();
    event.preventDefault();
  }
}

onMount(() => scrollToBottom())

const scrollToBottom = async () => {
  const node = document.getElementById('chat-box');
  if (!node) return;
  node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
};

// Auto scroll
chatMessages.subscribe(async () => {
  const node = document.getElementById('chat-box');
  if (!node) return;
  if (Math.abs(node.scrollHeight - node.scrollTop - node.clientHeight) < 100) {
    await tick();
    scrollToBottom();
  }
});
</script>

<div class="h-full min-h-0 flex flex-col p-4">
  <div id="chat-box" class="mt-auto mb-4 overflow-y-auto" style="flex-grow:0;flex-shrink:1">
    {#each $chatMessages as msg}
      <div class="break-words">
        {#if msg.playerId}
          <span class="text-red-500">{$gameState.players.get(msg.playerId)?.name}</span>: {msg.text}
        {:else}
          <i>{msg.text}</i>
        {/if}
      </div>
    {/each}
  </div>

  <div class="flex">
    <input class="input mr-2" type="text" placeholder="Message..." bind:value={newMsg} on:keydown={handleKeyDown} />
    <button on:click={sendMsg} type="button" class="btn-icon btn-icon-md variant-filled rounded-lg shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
      </svg>
    </button>
  </div>
</div>
