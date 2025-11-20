📘 College Lost & Found Portal

A full-stack web application designed to help students report, search, and recover lost or found items within a campus environment.
Built using React (Next.js) for the frontend and Node.js, Express, and MongoDB for the backend, the system provides a smooth, responsive interface and secure data handling.

🚀 Features
👩‍🎓 Student Features

Register & Login

Post lost or found items

Search items by keywords or category

View item details and contact owner/finder

Manage personal posts

Edit profile & manage settings

Access FAQs

🛠️ Admin Features

Admin login

View dashboard statistics

Manage all item posts

Approve/reject claims (optional)

Manage users

Edit profile & admin settings

🧠 Tech Stack
Frontend~

React.js (Next.js App Router)

JavaScript (ES6+)

HTML5, CSS3

Fetch / Custom Hooks

Vercel (Deployment)

Backend~

Node.js

Express.js

MongoDB Atlas

Mongoose ODM

Dotenv, CORS

Thunder Client/Postman (API testing)

Tools~

Git & GitHub

VS Code

Draw.io (UML diagrams)

📂 Project Structure
College-Lost-Found/
│
├── Back-end/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── Front-end/
    ├── app/
    ├── components/
    ├── hooks/
    ├── styles/
    ├── package.json
    └── public/

🔌 API Endpoints
Items
Method	Endpoint	Description
GET	/api/items	Get all items
POST	/api/items	Add new lost/found item
GET	/api/items/:id	Get single item details

Example Payload (POST /api/items)

{
  "title": "Lost Wallet",
  "description": "Black leather wallet near the canteen",
  "contact": "9876543210",
  "type": "lost"
}

⚙️ Local Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/college-lost-found.git
cd college-lost-found

2️⃣ Backend Setup
cd Back-end
npm install


Create a .env file:

MONGO_URI=your_mongodb_uri
PORT=5000


Run the backend:

node server.js

3️⃣ Frontend Setup
cd Front-end
npm install
npm run dev


🤝 Contributing

Contributions are welcome!
Feel free to fork the project, create a branch, and submit a pull request.

🧑‍💻 Author

Maaz Khan
B.Tech CSE, MIT College Ujjain (RGPV University)
📧 Your Email
🌐 Portfolio (optional)
💻 GitHub: https://github.com/Maazfr

📄 License

This project is licensed under the MIT License.
