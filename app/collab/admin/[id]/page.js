import AdminPanel from "@/components/AdminPanel";

async function CollabAdminPanel({ params }) {

  const { id } = await params;
  return (
   <AdminPanel id={id}/>
  )
}

export default CollabAdminPanel;
