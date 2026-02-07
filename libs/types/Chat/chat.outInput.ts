export interface Message {
	id: string;
	text: string;
	sender: 'user' | 'bot';
	timestamp: Date;
	quickReplies?: string[];
}

export interface ChatResponse {
	response: string;
	quickReplies?: string[];
	confidence?: number;
}

export interface ChatMessageInput {
	message: string;
	context?: string[];
}
