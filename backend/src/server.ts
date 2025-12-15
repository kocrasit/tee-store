import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:3000")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket: any) => {
    console.log('New client connected:', socket.id);

    socket.on('join_room', (room: string) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.set('io', io);

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    // Server restarted
});
