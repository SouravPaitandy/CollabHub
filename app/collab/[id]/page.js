import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UnifiedWorkspace from "@/components/collab/UnifiedWorkspace";
import { redirect } from "next/navigation";

export default async function CollabPage({ params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    redirect("/auth");
  }

  return <UnifiedWorkspace collabId={id} />;
}
