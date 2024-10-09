import { get, writable } from "svelte/store";
import { goto } from "$app/navigation";
import { Client, Room } from "colyseus.js";

const endpoint = import.meta.env.VITE_SERVER_ENDPOINT;
const client = new Client(endpoint);

export const room = writable(null);

export const chatMessages = writable([]);

export const gameState = writable(null);

const afterJoin = async (r: Room) => {
  goto(`?room=${r.roomId}`);

  addDefaultListeners(r);
}

export const addDefaultListeners = (r: Room) => {
  r.onStateChange((state) => {
    gameState.set(state);
  });

  r.onMessage("chat_msg", (message) => {
    chatMessages.update(currentItems => [...currentItems, message]);
  });
}

export const createRoom = async (name: string, avatar: string) => {
  try {
    const joinedRoom: Room = await client.create('uno_room', { name, avatar });
    room.set(joinedRoom);

    await afterJoin(joinedRoom);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const joinRoom = async (roomId: string, name: string, avatar: string) => {
  if (!await checkRoomExists(roomId)) throw Error('Cette room n\'existe pas, qu\'est-ce que tu branle khey ?')

  try {
    const joinedRoom: Room = await client.joinById(roomId, { name, avatar });
    room.set(joinedRoom);

    await afterJoin(joinedRoom);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const leaveRoom = () => {
  room.update((currentRoom) => {
    if (currentRoom) {
      currentRoom.leave();
    }
    return null; // Reset the store
  });
};

export const checkRoomExists = async (roomId: string) => {
  try {
    // Get the list of active rooms
    const rooms = await client.getAvailableRooms('uno_room'); // Replace 'my_room' with your room name

    // Check if the roomId exists in the available rooms
    const roomExists = rooms.some(room => room.roomId === roomId);

    return roomExists;
  } catch (error) {
    console.error("Error checking room existence:", error);
    return false; // Return false in case of an error
  }
}

export const getNonSpectatorPlayers = (_players: object) => {
  const players = _players ? _players : Object.fromEntries(get(gameState).players);
  const map = new Map();

  for (const [key, value] of Object.entries(players)) {
    if (!value.spectator) map.set(key, value);
  }
  return map;
}
