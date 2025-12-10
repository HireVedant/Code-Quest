#CodeQuest — Interactive Web Coding Playground

CodeQuest is an interactive coding environment designed to help beginners and intermediate learners practice and improve their HTML, CSS, and JavaScript skills. It provides a clean, user-friendly code editor, real-time preview, XP-based leveling system, and project-saving functionality — all inside a single responsive interface.

🚀 Features
📝 Multi-Tab Code Editor

Separate editors for HTML, CSS, and JavaScript

Syntax-highlighted input fields

“Beautify” button to format messy code

“Clear” button to reset the editor

⚡ Live Preview

Real-time rendering of HTML, CSS, and JS

“Clear Preview” option to reset the output view

Great for learning and experimenting with code instantly

🧪 Console Panel

Built-in console output area

Displays logs, errors, and JavaScript output

Helps beginners understand debugging

🎮 Gamified Learning

XP progress bar

Level system to motivate consistent practice

💾 Saved Projects

Save your code directly inside the environment

Automatically loaded when you revisit the project

Organize and manage multiple code sessions

🔘 Control Buttons

Run – Execute the combined HTML/CSS/JS

Save – Save current code as a project

End Session – Clears editor and resets session state

📂 Project Structure
/project-root
│
├── index.html
├── style.css
├── script.js
│
├── /assets
│   └── icons, images, etc.
│
└── README.md


(Structure may vary depending on your final implementation.)

🛠️ Technologies Used

HTML5

CSS3

JavaScript (ES6)

CodeMirror / Ace Editor (if used)

LocalStorage API for saving projects

📦 Installation & Setup

Clone the repository

git clone https://github.com/yourusername/codequest.git


Open the project folder

cd codequest


Run the project

Open index.html directly in your browser
or

Use a simple local server:

npx http-server

🧠 How It Works
1️⃣ Code Editing

Users write HTML, CSS, and JavaScript in separate editor panes.

2️⃣ Run System

When “Run” is clicked:

The app merges the code

Injects it into an iframe

Displays a live preview of the output

3️⃣ Console

JavaScript console.log() and errors appear in the built-in console panel.

4️⃣ Saved Projects

Projects are stored using localStorage

They load automatically at the start of a session

Users can save unlimited sessions

📸 Screenshot

(Add your screenshot here)

🎯 Future Improvements

Dark/Light theme toggle

Download project as ZIP

Share code with unique links

Pre-built coding challenges

Leaderboard & achievements

📜 License

This project is licensed under the MIT License — feel free to modify and build upon it.
