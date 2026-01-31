"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const CollabContext = createContext(null);

export const useCollab = () => {
  const context = useContext(CollabContext);
  if (!context) {
    throw new Error("useCollab must be used within a CollabProvider");
  }
  return context;
};

export const CollabProvider = ({ collabId, children }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!collabId || !session?.user) return;

    // Prevent duplicate connection if already connected to same room
    if (socketRef.current?.connected) {
      console.log(
        "[CollabProvider] Reusing existing connection:",
        socketRef.current.id
      );
      setIsConnected(true);
      setSocket(socketRef.current);
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080";
    console.log(
      `[CollabProvider] Connecting to ${socketUrl} for room ${collabId}`
    );

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      // Pass auth/query data here if needed for handshake
      query: {
        userId: session.user.email,
        userName: session.user.name,
      },
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("[CollabProvider] Connected:", newSocket.id);
      setIsConnected(true);
      setSocket(newSocket);

      // Join the room explicitly on connection
      newSocket.emit("join_room", collabId);
    });

    newSocket.on("connect_error", (err) => {
      console.error("[CollabProvider] Connection Error:", err.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("[CollabProvider] Disconnected:", reason);
      setIsConnected(false);
    });

    // Handle online users updates if server supports it (future proofing)
    newSocket.on("room_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      // CRITICAL: Don't disconnect in Strict Mode cleanup
      // Only disconnect if we're truly unmounting (collabId changed)
      console.log("[CollabProvider] Cleanup triggered");
      // In Strict Mode, this cleanup runs immediately but the effect re-runs
      // So we DON'T want to disconnect a working socket
      // The check at the top of the effect will reuse it
    };
  }, [collabId, session]); // Re-connect only if room or user changes significantly

  const value = {
    socket,
    isConnected,
    collabId,
    currentUser: session?.user,
  };

  return (
    <CollabContext.Provider value={value}>{children}</CollabContext.Provider>
  );
};
