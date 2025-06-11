import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { toast } from "react-hot-toast";
import { debounce } from "lodash";

export const setupYjsProvider = ({ 
  documentId, 
  ydocRef, 
  wsProviderRef, 
  setConnected 
}) => {
  // Clean up any existing connection first
  if (wsProviderRef.current) {
    wsProviderRef.current.destroy();
    wsProviderRef.current = null;
  }

  // Don't proceed if we don't have a document ID
  if (!documentId) return;

  // Initialize Y.Doc if needed
  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }

  // Initialize WebsocketProvider
  try {
    const wsProtocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
    const wsUrl =  process.env.NEXT_PUBLIC_WS_URL;
    // `${wsProtocol}://localhost:8080` ||

    wsProviderRef.current = new WebsocketProvider(
      wsUrl,
      documentId,
      ydocRef.current
    );

    // Track connection status
    const handleStatusChange = (event) => {
      setConnected(event.status === "connected");
    };

    wsProviderRef.current.on("status", handleStatusChange);

    // Set initial connection status
    setConnected(wsProviderRef.current.wsconnected);
  } catch (error) {
    console.error("Error initializing WebSocket provider:", error);
    toast.error("Failed to connect to collaboration server");
  }

  // Cleanup function
  return () => {
    if (wsProviderRef.current) {
      wsProviderRef.current.off("status");
      wsProviderRef.current.destroy();
      wsProviderRef.current = null;
    }
  };
};

export const setupAwareness = ({ 
  wsProvider, 
  userData, 
  setActiveUsers 
}) => {
  // Update local user state in the provider
  wsProvider.awareness.setLocalStateField("user", userData);

  // Create a stable reference to the awareness change handler
  const debouncedAwarenessHandler = debounce(() => {
    if (!wsProvider) return;

    const states = wsProvider.awareness.getStates();
    const uniqueUsers = new Map();

    Array.from(states.entries()).forEach(([clientId, state]) => {
      if (state.user && state.user.name) {
        uniqueUsers.set(state.user.name, {
          ...state.user,
          clientId,
        });
      }
    });

    const users = Array.from(uniqueUsers.values());
    setActiveUsers(users);
  }, 300);

  // Add event listener for awareness changes
  wsProvider.awareness.on("change", debouncedAwarenessHandler);

  // Initial call to set active users
  debouncedAwarenessHandler();

  // Cleanup function
  return () => {
    if (wsProvider?.awareness) {
      wsProvider.awareness.off("change", debouncedAwarenessHandler);
    }
    debouncedAwarenessHandler.cancel();
  };
};