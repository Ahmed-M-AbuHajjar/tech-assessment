import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployees } from '@/lib/actions/employee';
import { getProjects } from '@/lib/actions/project';
import { format } from 'date-fns';

export default async function DashboardPage() {
  const session = await auth();
  const organizationId = session?.user?.organizationId;

  // Fetch data
  const employeesResult = await getEmployees(organizationId);
  const projectsResult = await getProjects(organizationId);

  // Calculate total tasks and completed tasks
  let totalTasks = 0;
  let completedTasks = 0;
  let recentTasks = [];
  if (projectsResult.success) {
    totalTasks = projectsResult.data.reduce(
      (sum, project) => sum + (project.tasks?.length || 0),
      0
    );
    completedTasks = projectsResult.data.reduce(
      (sum, project) => sum + (project.tasks?.filter(task => task.status === 'DONE').length || 0),
      0
    );
    // Get the 5 most recent tasks across all projects
    recentTasks = projectsResult.data
      .flatMap((project) => project.tasks.map((task) => ({ ...task, projectName: project.name })))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Total active employees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{employeesResult.data?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Ongoing projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{projectsResult.data?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Total tasks across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
            <CardDescription>Tasks marked as done</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{completedTasks}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest tasks created</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {recentTasks.length === 0 && <li>No recent tasks.</li>}
              {recentTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center">
                  <span>
                    <span className="font-medium">{task.title}</span> in <span className="text-muted-foreground">{task.projectName}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{format(new Date(task.createdAt), 'PPP')}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* You can add more widgets here, e.g., charts, announcements, etc. */}
      </div>
    </div>
  );
} 