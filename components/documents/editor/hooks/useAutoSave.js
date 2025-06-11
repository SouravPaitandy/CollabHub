import { useEffect } from "react";

export function useAutoSave({ editor, connected, saveDocument }) {
  useEffect(() => {
    if (!editor || !connected) return;

    const interval = setInterval(saveDocument, 60000); // 60 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [editor, connected, saveDocument]);
}