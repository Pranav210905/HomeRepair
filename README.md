# 🛠️ Home Repair Services Website

A modern web platform for booking and managing home repair and maintenance services. This project connects users with trusted service providers for tasks such as plumbing, electrical work, carpentry, and more.

🔗 **Live Site:** [home-repair-eight.vercel.app](https://home-repair-eight.vercel.app/)

---

## 🚀 Features

- 🔍 Browse and search for various home services
- 🧑‍💼 Book services directly from the website
- 📅 Manage service schedules
- 🌐 Multilingual support (if applicable)
- 💬 Help and support chatbot
- 🔒 Authentication & authorization
- 🎨 Responsive and modern UI using Tailwind CSS

---

## 🛠️ Tech Stack

| Tech         | Description                              |
|--------------|------------------------------------------|
| **Frontend** | React, TypeScript, Tailwind CSS          |
| **Backend**  | Flask / Node.js (specify if applicable)  |
| **Database** | Firebase Firestore / MongoDB             |
| **Other**    | LangChain, Gemini API, Deep Translator   |
| **Deployment** | Vercel                                 |

---

## 📁 Folder Structure (Example)

home-repair/ 
├── backend/ # Flask backend

│ ├── app/ 

│ └── app.py # App runner

│ ├── frontend/ # React frontend 

│ ├── public/

│ ├── src/

│ │ ├── components/ # Reusable components (Navbar, Footer, etc.) 

│ │ ├── pages/ # Pages (Home, Bookings, Help, etc.) 

│ │ ├── context/ # Auth and Global Context Providers

│ │ ├── hooks/ # Custom React hooks 

│ │ ├── services/ # Axios/Fetch API calls to Flask backend

│ │ ├── App.tsx 

│ │ └── main.tsx 

│ ├── tailwind.config.js 

│ └── vite.config.ts 

│ ├── README.md 

└── package.json / requirements.txt





---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js ≥ 16.x
- Python ≥ 3.9
- Firebase account
- Gemini API access


## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd appliance-repair-service-provider
```

2. Install dependencies

```bash
npm install
```

3. Create a Firebase project

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Set up Firestore database
- Enable Authentication with Email/Password method

4. Configure environment variables

- Copy the `.env.example` file to `.env`
- Fill in your Firebase configuration details

```bash
cp .env.example .env
```

5. Start the development server

```bash




## Backend Setup

The backend is built with Flask and connects to Firebase Firestore:

1. Navigate to the `flask_backend` directory
2. Install requirements: `pip install -r requirements.txt`
3. Add your Firebase service account JSON to the directory
4. Start the server: `python app.py`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production

npm run dev
```
