# Node Chat App (v3)

A real-time chat application built with **Node.js**, **Express**, and **Socket.io**. Users can join custom rooms, send messages, share their location, and receive live updates — all powered by WebSockets.

## 💬 Features

- Real-time 1-to-many messaging via WebSockets
- Join chat rooms with a unique username
- Send and receive messages instantly
- Share your live location
- Auto-scroll for chat windows
- Form input validation (username/room required)
- Clean and responsive UI

## 🚀 Tech Stack

| Component     | Tech Used         |
|---------------|-------------------|
| Backend       | Node.js, Express  |
| WebSockets    | Socket.io         |
| Frontend      | HTML, CSS, JavaScript, Mustache.js |
| Geolocation   | HTML5 Geolocation API |
| Templating    | Mustache.js       |
| Date Handling | Moment.js         |

## 📁 Project Structure
├── public/               # Client-side assets
│   ├── css/
│   ├── js/
│   ├── chat.html
│   └── index.html
├── src/
│   ├── utils/
│   │   ├── messages.js
│   │   └── users.js
│   └── index.js          # Main server file
├── package.json
└── README.md

Key Concepts Used
	•	Socket.io emit, on, broadcast methods
	•	Room-based communication (socket.join, io.to(room).emit)
	•	User tracking with in-memory data structures
	•	Client-server architecture for real-time updates

 Security Notes
	•	This is a demo app and does not include authentication
	•	Do not use in production without adding login, HTTPS, and rate limiting

✨ Future Enhancements
	•	Add user authentication (JWT, OAuth)
	•	Persist chat history with MongoDB
	•	Admin controls for rooms
	•	Better mobile UI styling
	•	Deploy to Heroku or Vercel

 👤 Author

Htet Aung Naing
📍 Toronto, Canada
📧 hanmaple92@gmail.com
🔗 GitHub Profile
