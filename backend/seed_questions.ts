import { db } from "./src/config/db";
import crypto from "crypto";

async function seed() {
    try {
        console.log("Starting Question Seeding...");
        
        // Get category IDs
        const catResult = await db.execute("SELECT id, slug FROM categories");
        const cats: Record<string, string> = {};
        catResult.rows.forEach((r: any) => {
            cats[r.slug] = r.id;
        });

        const questions = [
            // FRONTEND
            {
                category_id: cats['frontend'],
                type: 'MCQ',
                title: 'HTML Structure',
                question_text: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'Hyper Top Markup Link', 'High Tech Markup Language', 'Hyper Link Markup Language'],
                correct_answer: 'A',
                marks: 2,
                difficulty: 'EASY'
            },
            {
                category_id: cats['frontend'],
                type: 'MCQ',
                title: 'Flexbox Controls',
                question_text: 'Which CSS property controls layout in Flexbox?',
                options: ['display', 'flex-direction', 'justify-content', 'all of the above'],
                correct_answer: 'D',
                marks: 2,
                difficulty: 'MEDIUM'
            },
            {
                category_id: cats['frontend'],
                type: 'MCQ',
                title: 'React Core',
                question_text: 'What is the virtual DOM in React?',
                options: ['A direct copy of the real DOM', 'An in-memory representation of the real DOM', 'A server-side rendered DOM', 'A legacy DOM API'],
                correct_answer: 'B',
                marks: 3,
                difficulty: 'MEDIUM'
            },
            {
                category_id: cats['frontend'],
                type: 'CODING',
                title: 'React Counter Logic',
                question_text: 'Create a React counter component using the useState hook. It should have increment and decrement buttons.',
                starter_code: 'import React, { useState } from "react";\n\nexport default function Counter() {\n  // Implement here\n}',
                marks: 10,
                difficulty: 'MEDIUM'
            },
            // BACKEND
            {
                category_id: cats['backend'],
                type: 'MCQ',
                title: 'Node.js Purpose',
                question_text: 'What is Node.js primarily used for?',
                options: ['Frontend Styling', 'Server-side execution', 'Database querying only', 'Mobile Application Design'],
                correct_answer: 'B',
                marks: 2,
                difficulty: 'EASY'
            },
            {
                category_id: cats['backend'],
                type: 'CODING',
                title: 'Express REST API',
                question_text: 'Create a REST API using Express.js with a single GET route /status that returns { status: "online" }.',
                starter_code: 'const express = require("express");\nconst app = express();\n\n// Implement route',
                marks: 15,
                difficulty: 'HARD'
            },
            // DATABASE
            {
                category_id: cats['database'],
                type: 'MCQ',
                title: 'SQL Fundamental',
                question_text: 'What does SQL stand for?',
                options: ['Structured Query Language', 'Simple Query Language', 'Sequential Query Language', 'Standard Query Language'],
                correct_answer: 'A',
                marks: 2,
                difficulty: 'EASY'
            },
            {
                category_id: cats['database'],
                type: 'CODING',
                title: 'Top Performers Query',
                question_text: 'Write an SQL query to fetch the top 5 students by score in descending order.',
                starter_code: '-- Table: students(id, name, score)\nSELECT ...',
                marks: 5,
                difficulty: 'MEDIUM'
            },
            // DSA
            {
                category_id: cats['dsa'],
                type: 'MCQ',
                title: 'Binary Search Efficiency',
                question_text: 'What is the time complexity of binary search?',
                options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'],
                correct_answer: 'C',
                marks: 5,
                difficulty: 'MEDIUM'
            },
            {
                category_id: cats['dsa'],
                type: 'CODING',
                title: 'Palindrome Detection',
                question_text: 'Check if a given string is a palindrome. Return true or false.',
                starter_code: 'function isPalindrome(str) {\n  // Implement\n}',
                marks: 10,
                difficulty: 'EASY'
            },
            // PROGRAMMING
            {
                category_id: cats['programming'],
                type: 'MCQ',
                title: 'OOP Concepts',
                question_text: 'What is Object-Oriented Programming?',
                options: ['A procedural method', 'A paradigm based on "objects" which contain data and code', 'A low-level language', 'None of the above'],
                correct_answer: 'B',
                marks: 2,
                difficulty: 'EASY'
            },
            {
                category_id: cats['programming'],
                type: 'CODING',
                title: 'Fibonacci Sequence',
                question_text: 'Print the first N numbers in the Fibonacci series.',
                starter_code: 'function fib(n) {\n  // Implement\n}',
                marks: 10,
                difficulty: 'MEDIUM'
            }
        ];

        for (const q of questions) {
            const id = crypto.randomUUID();
            await db.execute({
                sql: `INSERT INTO questions (
                    id, category_id, type, title, question_text, 
                    options, correct_answer, marks, difficulty, starter_code
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    id, q.category_id, q.type, q.title, q.question_text,
                    q.options ? JSON.stringify(q.options) : null,
                    q.correct_answer || null,
                    q.marks, q.difficulty,
                    q.starter_code || null
                ]
            });
        }

        console.log(`Successfully seeded ${questions.length} initial questions.`);
    } catch (e: any) {
        console.error("Seeding failed:", e);
    }
    process.exit(0);
}

seed();
