# 🎵 IO Music – A Spotify-Inspired Music App

Welcome to **IO Music** — a full-stack music streaming app built with Spring Boot and React. Think of it as a mini Spotify clone where you can search songs, explore albums, build playlists, and queue up your favorite tracks — all from a sleek, responsive UI.

This project was a way for me to learn and build a complete system from backend microservices to a polished frontend. And now, you can run it locally too!

---

## ✨ What It Can Do

- ✅ **Login & Sign Up** – Create an account and get started quickly.
- 🔍 **Search Everything** – Look up songs, albums, and artists with blazing-fast search.
- 🎧 **Play Music (Sort of)** – Add songs to your queue, skip, replay, and simulate play history.
- 📁 **Create Playlists** – Make custom playlists, add/remove songs, and explore what you've built.
- 🎵 **Browse Albums & Songs** – Check out popular albums and tracks, or explore by artist.
- 🖥️ **Responsive Frontend** – Looks good on both desktop and mobile (thanks, Bootstrap).

---

## 🧱 Tech Stack

### Backend – Spring Boot Microservices

- **Spring Boot** – Clean and modular microservices
- **Spring Security** – Handles authentication and JWT tokens
- **Spring Data JPA** – For database CRUD operations
- **PostgreSQL** – The database of choice
- **Eureka** – For service discovery between microservices

### Frontend – React

- **React (with TypeScript)** – Fast, component-based UI
- **React Router** – Smooth navigation
- **Bootstrap** – Clean, responsive design
- **Axios** – API calls to the backend

---

## 🧩 Microservices Breakdown

| Service                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `user-service`         | Manages user accounts and login/authentication      |
| `songs-albums-service` | Handles everything related to songs and albums      |
| `playlists-service`    | Lets users create and manage playlists              |
| `search-service`       | Powers global search for songs, albums, and artists |

Each service runs independently, and they talk to each other via REST APIs.

---

## 🔧 How to Run It

### 🐘 Backend

1. Make sure PostgreSQL is running and create separate databases for each service.
2. Clone the project and go into each microservice folder.
3. Run them one by one:

```bash
cd user-service
./mvnw spring-boot:run

cd ../songs-albums-service
./mvnw spring-boot:run

cd ../playlists-service
./mvnw spring-boot:run

cd ../search-service
./mvnw spring-boot:run
```

Each service will start on its own port (8081, 8082, etc.).

### 💻 Frontend

```bash
cd frontend
npm install
npm start
```

Then head over to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials

Want to explore it right away?

```
Username: user1
Password: password
```

---

## 🗂️ Project Structure

```
/user-service
/songs-albums-service
/playlists-service
/search-service
/frontend
```

Each folder is a standalone piece of the app, making the whole system easier to manage and scale.

---

## 📸 Screenshots (Coming soon!)

- Want to see what it looks like? Add a few screenshots in a `/screenshots` folder and link them here! \*

---

## 🚀 What's Next?

This was my first full-stack microservices project, but there’s so much more I want to add:

- Real audio streaming 🎶
- User recommendations based on listening history
- Docker + Kubernetes support
- CI/CD pipeline for easy deployment
- Social features: follow users, shared playlists, etc.

---

## 📄 License

MIT – use it however you like. Just give credit if you find it useful!

---

## 👋 About Me

Hey! I'm **Tejas Deshpande** 👨‍💻  
I'm passionate about full-stack development and love building real-world apps to learn by doing. Feel free to fork this project, give feedback, or just say hi!

[LinkedIn](https://www.linkedin.com/in/tejas-deshpande-910b18217/)
