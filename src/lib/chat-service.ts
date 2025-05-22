import { prisma } from "@/lib/prisma";

export interface ChatResponse {
  content: string;
  error?: string;
}

export class ChatService {
  static async getResponse(message: string): Promise<ChatResponse> {
    try {
      // Convert message to lowercase for easier matching
      const lowerMessage = message.toLowerCase();

      // Check for task-related queries
      if (lowerMessage.includes('task') || lowerMessage.includes('tasks')) {
        const tasks = await prisma.task.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            project: true,
            assignedTo: true
          }
        });

        if (tasks.length === 0) {
          return {
            content: "You don't have any tasks yet. Would you like to create one?"
          };
        }

        // Check for specific task status queries
        if (lowerMessage.includes('todo') || lowerMessage.includes('pending')) {
          const todoTasks = tasks.filter(task => task.status === 'TODO');
          return {
            content: todoTasks.length > 0 
              ? `Here are your pending tasks:\n${todoTasks.map(task => 
                  `- ${task.title} (Project: ${task.project.name})`
                ).join('\n')}`
              : "You don't have any pending tasks!"
          };
        }

        if (lowerMessage.includes('progress') || lowerMessage.includes('working')) {
          const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
          return {
            content: inProgressTasks.length > 0 
              ? `Here are your in-progress tasks:\n${inProgressTasks.map(task => 
                  `- ${task.title} (Project: ${task.project.name})`
                ).join('\n')}`
              : "You don't have any tasks in progress!"
          };
        }

        if (lowerMessage.includes('done') || lowerMessage.includes('completed')) {
          const doneTasks = tasks.filter(task => task.status === 'DONE');
          return {
            content: doneTasks.length > 0 
              ? `Here are your completed tasks:\n${doneTasks.map(task => 
                  `- ${task.title} (Project: ${task.project.name})`
                ).join('\n')}`
              : "You haven't completed any tasks yet!"
          };
        }

        return {
          content: `Here are your recent tasks:\n${tasks.map(task => 
            `- ${task.title} (${task.status}) - Project: ${task.project.name}`
          ).join('\n')}`
        };
      }

      // Check for project-related queries
      if (lowerMessage.includes('project') || lowerMessage.includes('projects')) {
        const projects = await prisma.project.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            tasks: true
          }
        });

        if (projects.length === 0) {
          return {
            content: "You don't have any projects yet. Would you like to create one?"
          };
        }

        // Check for project status queries
        if (lowerMessage.includes('active') || lowerMessage.includes('ongoing')) {
          const activeProjects = projects.filter(project => 
            project.tasks.some(task => task.status !== 'DONE')
          );
          return {
            content: activeProjects.length > 0 
              ? `Here are your active projects:\n${activeProjects.map(project => 
                  `- ${project.name} (${project.tasks.length} tasks)`
                ).join('\n')}`
              : "You don't have any active projects!"
          };
        }

        return {
          content: `Here are your recent projects:\n${projects.map(project => 
            `- ${project.name} (${project.tasks.length} tasks)`
          ).join('\n')}`
        };
      }

      // Help command
      if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return {
          content: `I can help you with the following:
1. Task Information:
   - "Show my tasks"
   - "What are my pending tasks?"
   - "Show tasks in progress"
   - "What tasks are done?"

2. Project Information:
   - "Show my projects"
   - "What are my active projects?"
   - "List all projects"

Just ask me about your tasks or projects in natural language!`
        };
      }

      // Default response for general queries
      return {
        content: "I can help you with information about your tasks and projects. Try asking about your recent tasks or projects, or type 'help' to see what I can do!"
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      return {
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 