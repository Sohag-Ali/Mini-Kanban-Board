export interface IAddBoardMemberPayload {
	email: string
	role?: 'EDITOR' | 'VIEWER'
}

export interface IUpdateBoardMemberPayload {
	role: 'EDITOR' | 'VIEWER'
}
