export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, priority, status, assignedEmployeeIds, projectId, startDate, dueDate } = body

    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Title and project ID are required' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        projectId,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedEmployees: {
          connect: assignedEmployeeIds?.map((id: string) => ({ id })) || []
        }
      },
      include: {
        assignedEmployees: true,
        project: true
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Error creating task' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, title, description, priority, status, assignedEmployeeIds, projectId, startDate, dueDate } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        projectId,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedEmployees: {
          set: assignedEmployeeIds?.map((id: string) => ({ id })) || []
        }
      },
      include: {
        assignedEmployees: true,
        project: true
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Error updating task' },
      { status: 500 }
    )
  }
} 