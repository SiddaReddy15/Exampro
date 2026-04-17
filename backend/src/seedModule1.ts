import { db } from "./config/db";
import { generateId } from "./utils/idGenerator";

const seedModule1 = async () => {
    console.log("Seeding Module 1: Advanced React & Node.js...");

    try {
        const examId = generateId();
        
        // 1. Create the Exam
        await db.execute({
            sql: "INSERT INTO exams (id, title, duration, passing_score, is_published) VALUES (?, ?, ?, ?, ?)",
            args: [examId, "Advanced React & Node.js", 60, 60, 1]
        });

        const mcqs = [
            { q: "What is the primary purpose of React Hooks?", o: ["To style components", "To manage state and lifecycle in functional components", "To connect databases", "To compile JavaScript"], a: "B", e: "React Hooks allow functional components to use state, lifecycle methods, and other features previously restricted to class components." },
            { q: "Which hook is used for side effects?", o: ["useState", "useEffect", "useRef", "useMemo"], a: "B", e: "useEffect is designed to handle side effects such as data fetching, subscriptions, and manual DOM manipulation." },
            { q: "What does Node.js use for asynchronous programming?", o: ["Multi-threading", "Event-driven architecture", "Sequential processing", "Java threads"], a: "B", e: "Node.js uses an event-driven, non-blocking I/O model based on a single-threaded event loop." },
            { q: "Which command initializes a Node.js project?", o: ["npm start", "npm build", "npm init", "node init"], a: "C", e: "The 'npm init' command creates a package.json file and initializes the project configuration." },
            { q: "Which database is commonly used with the MERN stack?", o: ["MySQL", "MongoDB", "Oracle", "PostgreSQL"], a: "B", e: "MongoDB is the 'M' in MERN (MongoDB, Express, React, Node), providing a flexible NoSQL document storage." },
            { q: "What is JSX?", o: ["A database query", "A JavaScript extension for writing HTML in React", "A CSS framework", "A testing tool"], a: "B", e: "JSX stands for JavaScript XML; it allows developer to write HTML-like syntax directly within JavaScript code." },
            { q: "Which middleware is used in Express for parsing JSON?", o: ["body-parser", "cors", "dotenv", "axios"], a: "A", e: "body-parser (now integrated in Express as express.json()) is used to parse incoming request bodies in JSON format." },
            { q: "What is the purpose of Redux?", o: ["Styling", "State management", "Routing", "Database storage"], a: "B", e: "Redux is a predictable state container for JavaScript apps, commonly used for global state management in React." },
            { q: "Which hook improves performance by memoizing values?", o: ["useEffect", "useMemo", "useContext", "useState"], a: "B", e: "useMemo caches the result of a calculation between re-renders, recalculating only when dependencies change." },
            { q: "Which command installs dependencies?", o: ["npm install", "npm run dev", "node install", "npm start"], a: "A", e: "The 'npm install' command reads package.json and installs all listed dependencies into the node_modules folder." },
            { q: "What is Express.js?", o: ["A frontend framework", "A Node.js backend framework", "A database", "A compiler"], a: "B", e: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications." },
            { q: "Which protocol is commonly used in REST APIs?", o: ["FTP", "HTTP", "SMTP", "TCP"], a: "B", e: "REST (Representational State Transfer) is an architectural style that primarily uses the HTTP protocol for communication." },
            { q: "Which method retrieves data in REST APIs?", o: ["GET", "POST", "PUT", "DELETE"], a: "A", e: "The GET method is used specifically to request or retrieve data from a specified resource." },
            { q: "What does JWT stand for?", o: ["Java Web Token", "JSON Web Token", "JavaScript Web Token", "JSON With Token"], a: "B", e: "JWT stands for JSON Web Token, a compact, URL-safe means of representing claims to be transferred between two parties." },
            { q: "Which React framework is used in this project?", o: ["Angular", "Vue", "Next.js", "Svelte"], a: "C", e: "Next.js is the chosen React framework for this platform, offering server-side rendering and optimized routing." },
            { q: "Which hook accesses context values?", o: ["useRef", "useContext", "useMemo", "useReducer"], a: "B", e: "useContext allows components to subscribe to React context without any nesting." },
            { q: "What is Tailwind CSS?", o: ["A database", "A utility-first CSS framework", "A JavaScript library", "A compiler"], a: "B", e: "Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup." },
            { q: "What is the default port for Node.js applications?", o: ["8080", "3000", "5000", "27017"], a: "B", e: "While configurable, 3000 is the standard default port for many Node.js and React development servers." },
            { q: "Which tool is used for API testing?", o: ["Postman", "Git", "Docker", "Jenkins"], a: "A", e: "Postman is an API platform for developers to design, build, test, and iterate their APIs." },
            { q: "What does CORS stand for?", o: ["Cross-Origin Resource Sharing", "Centralized Object Routing System", "Code Oriented Resource Sharing", "Cross-Origin Response System"], a: "A", e: "CORS is a security feature that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources." }
        ];

        // 2. Insert MCQs
        for (const mcq of mcqs) {
            await db.execute({
                sql: "INSERT INTO questions (id, exam_id, type, question_text, options, correct_answer, explanation, marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                args: [generateId(), examId, "MCQ", mcq.q, JSON.stringify(mcq.o), mcq.a, mcq.e, 4] // 4 marks each = 80 marks total
            });
        }

        // 3. Insert Coding Questions
        const coding = [
            { q: "Easy: Reverse a String. Write a function to reverse a string.", m: 5 },
            { q: "Medium: Build a REST API. Create a Node.js Express API for managing exams with CRUD operations.", m: 7 },
            { q: "Hard: React Authentication System. Implement JWT authentication using React, Context API, and Protected Routes.", m: 8 }
        ];

        for (const code of coding) {
            await db.execute({
                sql: "INSERT INTO questions (id, exam_id, type, question_text, marks) VALUES (?, ?, ?, ?, ?)",
                args: [generateId(), examId, "CODING", code.q, code.m]
            });
        }

        console.log("Successfully seeded Module 1.");
    } catch (error) {
        console.error("Error seeding:", error);
    }
};

seedModule1();
