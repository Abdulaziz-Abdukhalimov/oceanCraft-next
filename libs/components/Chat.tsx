// src/components/Chatbot.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { X, Send } from 'lucide-react';
import { GET_GREETING } from '../../apollo/user/query';
import { SEND_MESSAGE } from '../../apollo/user/mutation';
import { Message } from '../types/Chat/chat.outInput';
import LogoutIcon from '@mui/icons-material/Logout';
import { fontSize } from '@mui/system';

/* ---------------- QuickReply ---------------- */

interface QuickReplyProps {
	text: string;
	onClick: (text: string) => void;
	disabled?: boolean;
}

const QuickReply: React.FC<QuickReplyProps> = ({ text, onClick, disabled }) => {
	return (
		<button
			className={`quick-reply-button ${disabled ? 'disabled' : ''}`}
			onClick={() => onClick(text)}
			disabled={disabled}
		>
			{text}
		</button>
	);
};

/* ---------------- ChatMessage ---------------- */

interface ChatMessageProps {
	message: Message;
	onQuickReply?: (text: string) => void;
	isLatest?: boolean;
	isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onQuickReply, isLatest, isLoading }) => {
	const isBot = message.sender === 'bot';

	return (
		<div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
			<div className="bubble">{message.text}</div>

			{isBot && isLatest && message.quickReplies && message.quickReplies.length > 0 && (
				<div className="quick-replies">
					{message.quickReplies.map((reply: any, index: any) => (
						<QuickReply key={index} text={reply} onClick={onQuickReply!} disabled={isLoading} />
					))}
				</div>
			)}

			<div className="timestamp">
				{new Date(message.timestamp).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				})}
			</div>
		</div>
	);
};

/* ---------------- Chatbot ---------------- */

export const Chatbot: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState('');
	const [context, setContext] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const [getGreeting] = useLazyQuery(GET_GREETING, {
		onCompleted: (data) => {
			setMessages([
				{
					id: Date.now().toString(),
					text: data.greeting.response,
					sender: 'bot',
					timestamp: new Date(),
					quickReplies: data.greeting.quickReplies,
				},
			]);
		},
		onError: () => {
			setMessages([
				{
					id: Date.now().toString(),
					text: 'Hey there! 🏄‍♂️ Welcome to OceanCraft! How can I help you today?',
					sender: 'bot',
					timestamp: new Date(),
					quickReplies: ['Browse Equipment', 'Book Activities', 'I need advice'],
				},
			]);
		},
	});

	const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
		onCompleted: (data) => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					text: data.sendMessage.response,
					sender: 'bot',
					timestamp: new Date(),
					quickReplies: data.sendMessage.quickReplies,
				},
			]);
			setIsLoading(false);
		},
		onError: () => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					text: 'Sorry, I encountered an error. Please try again.',
					sender: 'bot',
					timestamp: new Date(),
					quickReplies: ['Try again'],
				},
			]);
			setIsLoading(false);
		},
	});

	useEffect(() => {
		if (isOpen && messages.length === 0) getGreeting();
	}, [isOpen, messages.length, getGreeting]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSendMessage = async (text: string) => {
		if (!text.trim() || isLoading) return;

		setMessages((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				text,
				sender: 'user',
				timestamp: new Date(),
			},
		]);

		setInputText('');
		setIsLoading(true);

		const newContext = [...context, `User: ${text}`];
		setContext(newContext);

		await sendMessageMutation({
			variables: {
				input: {
					message: text,
					context: newContext.slice(-6),
				},
			},
		});

		setContext((prev) => [...prev, `Bot: (response generated)`]);
	};

	return (
		<>
			{!isOpen && (
				<button className="chat-toggle" onClick={() => setIsOpen(true)}>
					<img src="/img/icons/chatWhite.svg" alt="" />
				</button>
			)}

			{isOpen && (
				<div className="chat-window">
					<div className="chat-header">
						<div className="title">
							<span className="avatar">🏄‍♂️</span>
							<div>
								<div className="name">OceanBot</div>
								<div className="status">Online Now</div>
							</div>
						</div>
						<button onClick={() => setIsOpen(false)}>
							<LogoutIcon style={{ fontSize: '24px' }} />
						</button>
					</div>

					<div className="chat-body">
						{messages.map((m, i) => (
							<ChatMessage
								key={m.id}
								message={m}
								isLatest={i === messages.length - 1}
								isLoading={isLoading}
								onQuickReply={handleSendMessage}
							/>
						))}

						{isLoading && (
							<div className="typing">
								<span />
								<span />
								<span />
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					<div className="chat-input">
						<input
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
							disabled={isLoading}
							placeholder="Type a message..."
						/>
						<button onClick={() => handleSendMessage(inputText)} disabled={!inputText.trim() || isLoading}>
							<Send size={18} />
						</button>
					</div>
				</div>
			)}
		</>
	);
};
