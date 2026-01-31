import { useEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";

export function useAutoSave({ editor, connected, saveDocument }) {
  // Create a ref for the save function to use inside the debounced callback
  // This avoids re-creating the debounced function when saveDocument changes
  const saveRef = useRef(saveDocument);

  useEffect(() => {
    saveRef.current = saveDocument;
  }, [saveDocument]);

  const debouncedSave = useMemo(
    () =>
      debounce(() => {
        saveRef.current && saveRef.current({ isAutoSave: true });
      }, 2000), // Wait 2s after last change
    [],
  );

  useEffect(() => {
    if (!editor || !connected) return;

    const onUpdate = ({ editor }) => {
      // Trigger save only on content change
      debouncedSave();
    };

    editor.on("update", onUpdate);

    return () => {
      editor.off("update", onUpdate);
      debouncedSave.cancel();
    };
  }, [editor, connected, debouncedSave]);
}
