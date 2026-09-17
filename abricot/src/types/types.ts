export type Projects = Project[];

export type Tasks = Task[];

export interface Project {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	ownerId: string;
	owner: {
		id: string;
		email: string;
		name: string;
	};
	members: Member[];
	_count: {
		tasks: number;
	};
	userRole: string;
}

interface Member {
	id: string;
	role: string;
	joinedAt: string;
	userId: string;
	projectId: string;
	user: User;
}

export interface User {
	id: string;
	email: string;
	name: string;
}

interface assignees {
	id: string;
	assignedAt: string;
	taskId: string;
	userId: string;
	user: User;
}

interface Comments {
	id: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	taskId: string;
	authorId: string;
	author: User;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	status: "IN_PROGRESS" | "TODO" | "DONE";
	priority: "HIGH" | "LOW" | "MEDIUM";
	dueDate: string;
	createdAt: string;
	updatedAt: string;
	projectId: string;
	creatorId: string;
	project: {
		id: string;
		name: string;
		description: string;
	};
	assignees: assignees[];

	comments: Comments[];
}
