import { toast } from "react-hot-toast";

export async function saveDocumentToAPI({
  collabId,
  documentId,
  documentTitle,
  content,
  onSave,
  isAutoSave = false,
}) {
  const response = await fetch(
    `/api/collab/${collabId}/documents/${documentId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: documentTitle, content }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to save document");
  }

  if (onSave) onSave(documentTitle, content);

  if (!isAutoSave) {
    toast.success("Document saved successfully");
  }
}
