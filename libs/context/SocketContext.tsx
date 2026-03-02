import { useReactiveVar } from '@apollo/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { userVar } from '../../apollo/store';

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface Props {
	children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const user = useReactiveVar(userVar);

	useEffect(() => {
		// Only connect if user is logged in
		if (!user?._id) {
			if (socket) {
				socket.disconnect();
				setSocket(null);
				setIsConnected(false);
			}
			return;
		}

		console.log('🔌 Connecting to Socket.IO...');

		// Connect to WebSocket server
		const newSocket = io('https://ocean-marinecraft.com/notifications', {
			transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
			reconnection: true, // Auto-reconnect
			reconnectionAttempts: 5,
			reconnectionDelay: 100,
		});

		// Connection successful
		newSocket.on('connect', () => {
			console.log('✅ Socket.IO connected:', newSocket.id);
			setIsConnected(true);

			// Join user's personal notification room
			newSocket.emit('joinNotificationRoom', { userId: user._id });
		});

		// Confirmation from backend that we joined the room
		newSocket.on('joinedRoom', (data) => {
			console.log('✅ Joined notification room:', data);
		});

		// Connection failed
		newSocket.on('connect_error', (error) => {
			console.error('❌ Socket.IO connection error:', error);
			setIsConnected(false);
		});

		// Disconnected
		newSocket.on('disconnect', (reason) => {
			console.log('🔌 Socket.IO disconnected:', reason);
			setIsConnected(false);
		});

		setSocket(newSocket);

		// Cleanup on unmount or user logout
		return () => {
			console.log('🔌 Disconnecting Socket.IO...');
			newSocket.disconnect();
		};
	}, [user?._id]); // Reconnect if user changes

	return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
