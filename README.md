# Chatapp - Real-Time Communication Application

## Live Link : https://chat-app-sepia-nine-89.vercel.app/

A modern, full-stack real-time messaging platform built with React, Spring Boot, and MongoDB. Connect with users through 
one-to-one chat with instant message delivery and live online status tracking.

---
## ✨ Features

✅ **User Authentication**
- User registration with email & password
- Secure login/logout with JWT tokens
- Password hashing with BCrypt
- Token expiration & refresh mechanism
- Auto-login for returning users

✅ **One-to-One Messaging**
- Real-time message delivery via WebSocket
- Persistent message storage in MongoDB
- Message history with pagination
- Message timestamps

✅ **Contact Management**
- View all active users
- Contact list with search functionality
- Filter users to start new conversations
- User profiles with display names
- Easy conversation creation

✅ **Live Status Tracking**
- Real-time online/offline user status
- Automatic status updates on login/logout
- Status broadcast to all connected users

✅ **Clean, Responsive UI**
- Minimal, professional design
- Mobile-responsive layout
- Sidebar for contacts
- Chat window with message history
- Smooth animations
- Custom CSS (no framework dependencies)

---

## 🎓 Key Skills Demonstrated

### Backend
- Spring Boot REST API design
- JWT authentication & security
- WebSocket real-time communication
- MongoDB data modeling
- Service-oriented architecture
- Dependency injection & Spring components

### Frontend
- React hooks and Context API
- Vite build tooling
- Axios HTTP client
- WebSocket client implementation
- CSS styling without frameworks
- Component composition & reusability
- Form validation and error handling

### Full-Stack
- End-to-end feature implementation
- Authentication flow
- Real-time synchronization
- Database design
- API design and documentation
- Clean code practices

---
## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.2
- **Language:** Java 17+
- **Database:** MongoDB
- **Authentication:** JWT with BCrypt
- **Real-Time Communication:** WebSocket
- **Build Tool:** Maven

### Frontend
- **Library:** React 18
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Routing:** React Router
- **State Management:** React Context
- **Styling:** Custom CSS (no frameworks)
- **Real-Time:** WebSocket Client

### Infrastructure
- **Version Control:** Git
- **Containerization:** Docker-ready

---
## 🚀 Quick Start

### Prerequisites
- Java 17+ ✅
- Node.js 18+ ✅
- MongoDB 5.0+ ✅
- Git ✅

### 1. Backend Setup (3 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies with Maven
mvn clean install

# Start MongoDB in another terminal
mongod

# Start backend server
mvn spring-boot:run
```

Backend server runs at: `http://localhost:8080`

### 2. Frontend Setup (2 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev
```

Frontend app runs at: `http://localhost:5173`

### 3. Test the Application (2 minutes)

1. Open your browser to `http://localhost:5173`
2. **Create two test users:**
   - Register User 1: username, email, password, display name
   - Register User 2: different email, password, display name
3. **Open two separate browser windows/tabs**
4. **Login with User 1 in first window**
5. **Login with User 2 in second window**
6. **Start chatting:**
   - In either window, click a contact from the sidebar
   - Type your message and hit send
   - See real-time message delivery in the other window
   - Watch online status update in real-time
7. **Test online status:**
   - Close one window and see the user appear as offline in the other
   - Reopen and watch them come back online

---

## 🏗️ Architecture

### Layered Backend Architecture
Clean separation of concerns for maintainability and testability:

```
REST Client (Frontend)
    ↓
Controller Layer (REST endpoints)
    ↓
Service Layer (Business logic)
    ↓
Repository Layer (MongoDB data access)
    ↓
MongoDB Database
```

### Real-Time WebSocket Flow
Instant message delivery and status updates:

```
User A (Client) ←→ WebSocket ←→ Server ←→ WebSocket ←→ User B (Client)
     ↓send msg              ↓broadcast         ↓save DB
```

### Frontend State Management
React Context provides efficient state handling:

- **AuthContext** → Manages authentication, current user, tokens
- **ChatContext** → Manages conversations, messages, online users
- **LocalStorage** → Persists auth tokens and user data

### Security Model

✅ **Authentication**
- BCrypt password hashing
- JWT tokens (15-min expiration)
- Refresh tokens (7-day expiration)
- Token validation on WebSocket connection

✅ **Authorization**
- Protected REST endpoints
- Users can only access their own conversations
- Ownership verification before message deletion

✅ **Data Validation**
- Input validation on frontend & backend
- Safe MongoDB queries with validation
- CORS configured for frontend origin

---

## 🎯 How It Works

### User Registration Flow
1. User fills registration form (username, email, password, display name)
2. Backend validates and checks for duplicates
3. Password encrypted with BCrypt
4. User document created in MongoDB
5. JWT token generated and returned
6. Frontend stores token in localStorage
7. User auto-logged in and redirected to chat

### Message Sending Flow
1. User types message in chat window
2. Click send or press Enter
3. Message sent via WebSocket
4. Server validates user is conversation participant
5. Message saved to MongoDB
6. Conversation's lastMessage updated
7. One-to-one broadcast: message delivered to recipient
8. Both see message appear in real-time

### Status Update Flow
1. User logins → Status set to "online"
2. WebSocket broadcasts to all connected users
3. All clients update their online status display
4. User logs out → Status set to "offline"
5. All clients see them go offline immediately

### Conversation Management
1. User can see all previous conversations in sidebar
2. Click conversation to load message history
3. Or click a contact to start/resume chat
4. One-to-one conversations automatically created
5. Message pagination loads 50 messages at a time

---

## 🎨 User Interface

### Main Views

**Login Page**
- Email and password input
- "Don't have account?" link to register
- Form validation
- Error messages for failed login

**Register Page**
- Username, email, password, display name inputs
- Duplicate username/email detection
- Password confirmation
- "Already have account?" link to login
- Real-time validation feedback

**Chat Interface**
- **Sidebar Left:** Contact list with search/filter
- **Sidebar Middle:** Conversation history
- **Main Area:** Chat window with message thread
- **Top Bar:** Current conversation info & user status
- **Input Bar:** Message composition area

### Key Components

**ContactList.jsx**
- Shows all active users
- Search/filter functionality
- Click user to start new conversation
- Online status indicator for each contact
- Scrollable for many users

**ConversationList.jsx**
- Lists all conversations for current user
- Shows last message preview
- Click to switch conversations
- Displays timestamp of last message
- Active conversation highlighted

**ChatWindow.jsx**
- Displays message thread
- Shows sender name and timestamp for each
- Message pagination (load older messages)
- Mark messages as read
- Input field for composing new messages

**UserList.jsx**
- Discover other active users
- Create new conversations
- Shows user's online status
- Display names prominently

---

## 🔒 Security Features

### Implemented
✅ Password hashing with BCrypt (10+ rounds)  
✅ JWT authentication with HMAC-SHA512  
✅ Token expiration (15 minutes for access, 7 days for refresh)  
✅ WebSocket authentication with JWT validation  
✅ Protected API routes require authentication  
✅ User can only access their own conversations  
✅ Input validation on backend  
✅ CORS configured to frontend origin only  

### Best Practices
- Tokens stored in localStorage (frontend)
- Auto-logout when token expires
- Refresh token used to get new access tokens
- Passwords never sent in plaintext
- HTTPS recommended for production

---

## 🚀 Future Enhancements

These features could be added in future versions:

- **Group Chat** - Create conversations with multiple users
- **Media Sharing** - Send images, videos, and files
- **Voice/Video Calling** - WebRTC for audio and video
- **Message Search** - Find messages by content
- **User Profiles** - Detailed user information and avatars
- **Message Reactions** - Emoji reactions to messages
- **Last Seen Indicator** - See exact last login time
- **Notification System** - Desktop and browser notifications
- **Message Encryption** - End-to-end encryption for security
- **Typing Indicators** - Show "User is typing..."

---

## 🤝 Contributing

This is a learning/portfolio project. You're welcome to:
- Add new features
- Fix bugs
- Improve documentation
- Optimize performance
- Submit pull requests

---

## 📄 License

Open source - Use for learning and personal projects.

---
