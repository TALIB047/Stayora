# 🏡 Stayora

Stayora is a full-stack accommodation rental web application inspired by platforms like Airbnb. It allows users to explore properties, create and manage listings, add reviews, and book accommodations.

The project demonstrates real-world concepts such as **CRUD operations, authentication, authorization, database relationships, image uploads, maps, and booking management**.

## ✨ Features

* 🏠 Create, edit, view & delete property listings
* 🔍 Search and filter properties
* 🔐 User signup, login & logout
* 🛡️ Authentication and authorization
* ⭐ Add and manage reviews & ratings
* 📅 Book properties with check-in, check-out & guest selection
* 💰 Automatic booking price calculation
* 🗺️ Interactive property maps using MapTiler
* ☁️ Image uploads using Cloudinary
* 📱 Responsive and user-friendly interface

## 🛠️ Tech Stack

| Category       | Technologies                          |
| -------------- | ------------------------------------- |
| Frontend       | HTML, CSS, JavaScript, EJS, Bootstrap |
| Backend        | Node.js, Express.js                   |
| Database       | MongoDB, Mongoose                     |
| Authentication | Passport.js, Express Session          |
| Services       | MapTiler, Cloudinary                  |
| Tools          | Git, GitHub                           |

## 📂 Project Structure

```text
Stayora/
│
├── controllers/
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── users.js
│
├── init/
│   ├── data.js
│   ├── index.js
│   └── updateGeometry.js
│
├── models/
│   ├── booking.js
│   ├── listing.js
│   ├── user.js
│   └── review.js
│
├── public/
│   ├── css/
│   └── js/
│
├── routes/
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── utils/
│   ├── expresserror.js
│   └── wrapAsync.js
│
├── views/
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
│
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
├── package.json
└── .gitignore
```

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/TALIB047/stayora.git
cd stayora
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=your_mongodb_url
MAPTILER_API_KEY=your_maptiler_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
SECRET=your_session_secret
```

### Run the application

```bash
npm start
```

Then open:

```text
http://localhost:8080
```

## 🔄 Application Flow

```text
User
 ↓
EJS Frontend
 ↓
Express Routes
 ↓
Controllers
 ↓
Mongoose Models
 ↓
MongoDB
```

Passport.js handles authentication, while custom middleware manages authorization and protected routes.

## 👨‍💻 Author

**Talib Anjum**

🔗 [GitHub](https://github.com/TALIB047)

---

⭐ If you like Stayora, consider giving the repository a star!
