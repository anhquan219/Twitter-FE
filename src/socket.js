import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URI);

// Dùng chung mọi nơi
export default socket;
