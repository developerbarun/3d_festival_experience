
# 🕉️ Hindu Festivals VR Experience

An immersive, web-based 3D learning platform that brings six major Hindu festivals to life. Built with Babylon.js and powered by AI, this project educates, engages, and celebrates culture through modern technology.

---

## 🎯 Overview

**Hindu Festivals VR Experience** is a fully interactive and educational 3D web application where users can explore the cultural richness of Hindu festivals like Diwali, Holi, Navratri, Ganesh Chaturthi, Dussehra, and Kumbh Mela through gamified and immersive scenes.

This project combines:
- 🧠 AI-powered cultural guide
- 🛕 Authentic 3D festival scenes
- 📈 Personalized learning and interaction tracking
- 🌐 Web-first design with mobile optimization

---

## ✨ Features

### 🔮 Immersive Festival Scenes
- **Diwali**: Light diyas, see rangolis, and learn about Lakshmi
- **Holi**: Throw colors in a vibrant courtyard
- **Navratri**: Learn Garba dance and Durga worship
- **Ganesh Chaturthi**: Join the processions and prepare modaks
- **Dussehra**: Burn the Ravana effigy and watch Ramlila
- **Kumbh Mela**: Take a holy dip and explore spiritual camps

### 🤖 AI & Personalization
- Ask questions about cultural traditions via integrated AI (Google Gemini)
- Receive personalized festival suggestions and learning paths via Qloo API
- Track user progress, behavior, and achievements

### 🔧 Technologies Used
- **Frontend**: Babylon.js, HTML5, CSS3, JavaScript (ES6+), Vite
- **Backend**: [To be implemented] – Node.js, Express, MongoDB/PostgreSQL
- **AI Integration**: Gemini AI, Qloo API
- **Analytics**: Custom behavior tracking, achievement system

---

## 🧩 Backend Architecture (Planned)

| Endpoint                  | Description                                |
|--------------------------|--------------------------------------------|
| `POST /auth/register`    | Register a new user                        |
| `GET /user/profile`      | Fetch or update user preferences           |
| `POST /analytics/event`  | Log user actions (clicks, interactions)    |
| `POST /user/progress`    | Save progress on specific festivals        |
| `POST /ai/log`           | Save questions asked to AI cultural guide  |
| `POST /feedback/submit`  | Submit feedback or festival rating         |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hindu-festivals-vr.git
cd hindu-festivals-vr
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
📦 hindu-festivals-vr/
├── public/               # Static assets (models, images, music)
├── src/
│   ├── components/       # Reusable UI & festival scenes
│   ├── scenes/           # Individual festival logic
│   ├── ai/               # AI integration (Gemini prompts)
│   ├── analytics/        # Tracking and event logging
│   └── main.js           # Entry point
├── server/ (planned)     # Express backend for progress tracking
├── package.json
└── README.md
```

---

## 📊 Future Enhancements

- 🎯 Full backend implementation with Express and database
- 🌍 Multi-language support (Hindi + English complete, others optional)
- 🧠 Gamified quizzes for each festival
- 🧬 Deeper personalization based on user behavior
- 🎓 Cultural certification on festival completion

---

## 🛡️ License

This project is open-source under the **MIT License**.

---

## 🙏 Acknowledgements

- Babylon.js team for the amazing 3D web engine
- Qloo API for cultural recommendation insights
- Google Gemini AI for contextual cultural Q&A
- Cultural experts and researchers for content accuracy

---

## 📬 Contact

If you’d like to collaborate or have feedback, feel free to reach out!
