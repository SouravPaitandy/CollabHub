import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DocumentsPage from "@/components/documents/DocumentPage";
import UnauthorizedMessage from "@/components/auth/UnauthorizedMessage";

export default async function DocumentsPageServer({ params }) {
  const userSession = await getServerSession(authOptions);
  const { docId:id } = await params;
  
  if(!userSession || !id) {
    return <UnauthorizedMessage />;
  }
  
  return (
    <DocumentsPage collabId={id}/>
  );
}