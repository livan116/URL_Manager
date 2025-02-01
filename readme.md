# 🔗 URL Shortener & Analytics System

A **Full-Stack URL Shortener** with **Analytics Tracking**, built using the **MERN Stack** (**MongoDB, Express, React, Node.js**).  
Users can **shorten URLs, track analytics (IP, Device, Clicks), and manage their links**.

---

## 🚀 **Live Demo**
🔗 [Live App](https://url-manager-kappa.vercel.app/)

---

## 📂 **Project Structure**
```
📦 URL-Shortener-Analytics
 ┣ 📂 frontend (React)
 ┣ 📂 backend (Node.js & Express)
 ┣ 📜 README.md
 ┗ 📜 package.json
```

---

## 🎯 **Features**
✅ Shorten URLs with a **custom short code**  
✅ Track analytics like **IP Address, Device, Click Count**  
✅ **Pagination & Filtering** for managing URLs  
✅ **JWT Authentication** for user security  
✅ **Rate Limiting** to prevent abuse  
✅ **Mobile-Responsive** & **Dark Mode Support**  

---

## 🛠️ **Technologies Used**

### **Frontend**
- React.js ⚛️
- Modular CSS (UI Styling)
- React Router (Navigation)
- Axios (API Calls)


### **Backend**
- Node.js (Backend)
- Express.js (Routing)
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- CORS (Security)
- dotenv (Environment Variables)

---

## ⚙️ **Installation Guide**

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/livan116/URL_Manager
cd URL_Manager
```

### **2️⃣ Setup Backend**
```bash
cd backend
npm install
```
✅ **Create a `.env` file in the backend directory:**
```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```
Run the Backend:
```bash
npm start
```

### **3️⃣ Setup Frontend**
```bash
cd ../frontend
npm install
```
Run the Frontend:
```bash
npm start
```

---

## 📌 **API Endpoints**

### **🔗 URL Management**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/url/shorten` | Shorten a URL |
| `GET` | `/api/url/:shortId` | Redirect to Original URL |
| `DELETE` | `/api/url/:id` | Delete a URL |
| `PUT` | `/api/url/:id` | Update a URL |
| `GET` | `/api/url/dashboard` | Fetch Dashboard Details |


---

## 🏗️ **Folder Structure**
```
📦 backend
 ┣ 📂 models
 ┣ 📂 routes
 ┣ 📂 controller
 ┣ 📜 index.js
 ┣ 📜 config.js
 ┣ 📜 package.json

📦 frontend
 ┣ 📂 src
 ┃ ┣ 📂 components
 ┃ ┣ 📜 App.js
 ┃ ┣ 📜 index.js
 ┣ 📜 package.json
```

---

## 🚀 **How It Works**

### **1️⃣ Shorten a URL**
- User enters a **long URL** in the frontend.
- API generates a **short URL** and stores it in the database.
- The short URL is displayed for **copying & sharing**.

### **2️⃣ Redirect from Short URL**
- When a user visits a **short URL**, the backend retrieves the **original URL** and redirects them.

### **3️⃣ Track Clicks & Analytics**
- Each time a short URL is clicked:
  - The **IP Address, Device Type, and Timestamp** are recorded.
  - The data is stored in the database.
  - The frontend displays real-time **analytics & click tracking**.

---

---

## 🛠️ **Deployment Guide**
### **1️⃣ Deploy Backend (Node.js & MongoDB)**
- **Use** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database.
- **Deploy on** [Render](https://render.com/) or [Vercel](https://vercel.com/).
- Set environment variables (`MONGO_URI`, `JWT_SECRET`).

### **2️⃣ Deploy Frontend (React)**
- **Use** [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- Configure `.env` with backend API URL.
- Build the frontend:
```bash
npm run build
```
- Deploy the `build` folder.


---


## 📞 **Contact**
💬 **Author**: M. Livan Kumar  
📧 **Email**: livankumar112@gmail.com 
🔗 **GitHub**: [livan115](https://github.com/yourusername)

