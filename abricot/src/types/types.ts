export interface Projects {
	projects: Project[];
}

export interface Tasks {
	tasks: Task[];
}

export interface Users {
	users: User[];
}

export type Comments = Comment[];

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

export interface Member {
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
	createdAt?: string;
	updatedAt?: string;
}

interface assignees {
	id: string;
	assignedAt: string;
	taskId: string;
	userId: string;
	user: User;
}

export interface Comment {
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

	comments: Comments;
}

export interface Success<T> {
	success: true;
	message: string;
	data: T;
}

export interface Error {
	success: false;
	message: string;
	error: string;
	details: [
		{
			field: string;
			message: string;
		},
	];
}

export type ResponseApi<T> = Success<T> | Error;
