import { useEffect } from "react";

export function useTypingTracker({ editor, wsProviderRef, userData, setTypingUsers }) {
  useEffect(() => {
    if (!editor || !wsProviderRef.current || !userData) {
      return;
    }

    let typingTimeout;
    let isTyping = false;
    const wsProvider = wsProviderRef.current;

    // Handle typing event
    const handleTyping = () => {
      if (!isTyping) {
        isTyping = true;

        // Make sure to preserve all existing user fields
        const currentState = wsProvider.awareness.getLocalState() || {};
        const currentUser = currentState.user || userData;

        wsProvider.awareness.setLocalStateField("user", {
          ...currentUser,
          typing: true,
        });
      }

      // Clear existing timeout
      clearTimeout(typingTimeout);

      // Set new timeout
      typingTimeout = setTimeout(() => {
        if (isTyping) {
          isTyping = false;

          // Get current state again to avoid overwriting other changes
          const currentState = wsProvider.awareness.getLocalState() || {};
          const currentUser = currentState.user || userData;

          wsProvider.awareness.setLocalStateField("user", {
            ...currentUser,
            typing: false,
          });
        }
      }, 2000);
    };

    // Listen for multiple events to better catch typing
    editor.on("keyDown", handleTyping);
    editor.on("input", handleTyping);

    // Add a DOM event listener for extra reliability
    const editorElement = document.querySelector(".ProseMirror");
    if (editorElement) {
      editorElement.addEventListener("keydown", handleTyping);
    }

    // Update typing users list
    const updateTypingUsers = () => {
      if (!wsProvider) return;

      const states = wsProvider.awareness.getStates();
      const typing = [];

      Array.from(states.entries()).forEach(([clientId, state]) => {
        // Skip if it's the current user or if typing is not true
        if (
          state.user &&
          state.user.typing === true &&
          state.user.name !== userData.name
        ) {
          typing.push({
            ...state.user,
            clientId,
          });
        }
      });

      // Only update state if it actually changed
      setTypingUsers((prev) => {
        const prevIds = new Set(prev.map((u) => u.clientId));
        const newIds = new Set(typing.map((u) => u.clientId));

        if (
          prev.length !== typing.length ||
          ![...prevIds].every((id) => newIds.has(id)) ||
          ![...newIds].every((id) => prevIds.has(id))
        ) {
          return typing;
        }
        return prev;
      });
    };

    // Initial check
    updateTypingUsers();

    // Add awareness change listener
    wsProvider.awareness.on("change", updateTypingUsers);

    // Clean up
    return () => {
      editor.off("keyDown", handleTyping);
      editor.off("input", handleTyping);

      if (editorElement) {
        editorElement.removeEventListener("keydown", handleTyping);
      }

      clearTimeout(typingTimeout);

      if (wsProvider && wsProvider.awareness) {
        wsProvider.awareness.off("change", updateTypingUsers);
      }
    };
  }, [editor, wsProviderRef.current, userData, setTypingUsers]);
}