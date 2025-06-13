import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UnauthorizedMessage from "@/components/auth/UnauthorizedMessage";
import TasksPage from "@/components/Task/TasksPage";

export default async function TasksPageServer({ params }) {
  const userSession = await getServerSession(authOptions);
  const { task } = await params;
  const collabId = task;
  console.log("Collaboration ID:", collabId);
  console.log("User Session:", userSession);
  
  if(!userSession || !collabId) {
    return <UnauthorizedMessage />;
  }

  
  return (
    <TasksPage 
      collabId={collabId}
      initialSession={{
        user: {
          email: userSession.user.email,
          name: userSession.user.name,
          image: userSession.user.image,
        },
        username: userSession.username || null
      }}
    />
  );
}
