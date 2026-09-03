export interface ICreateTaskPayload {
	title: string
	description?: string
}

export interface IUpdateTaskPayload {
	title?: string
	description?: string | null
}
