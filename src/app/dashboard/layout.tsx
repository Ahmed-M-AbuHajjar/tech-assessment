import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";
import { updateUserToBlurrOrganization } from '@/lib/actions/user'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  console.log('Dashboard layout - User:', session.user.id)
  
  // Update user's organization in the background
  updateUserToBlurrOrganization(session.user.id).catch(console.error)

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
} 