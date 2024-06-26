// route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../db';
import Message from '../models/messageModel';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY as string;  // replace 'YOUR_API_KEY' with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

const history = [] as any

async function fetchBotResponse(userMessage: string): Promise<any> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // history.push({role: "user", parts: [{ text: userMessage }]})

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 100,
        },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    // history.push({role: "model", parts: [{ text: response.text() }]})
    return response.text();
    } catch (error) {
        console.log(error);
        
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { messages } = await req.json();
        const userMessage = messages && messages.length ? messages[messages.length - 1].content : "";

        let botResponse = await fetchBotResponse(userMessage);

        if (!botResponse) {
            botResponse = "No response from the bot.";
        }

        const newMessage = new Message({
            question: userMessage,
            answer: botResponse,
        });

        await newMessage.save();
        
        return NextResponse.json({ text: botResponse });
    } catch (error) {
        console.error("Error handling POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}





















// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../db';
// import Message from '../models/messageModel';

// export async function POST(req: NextRequest) {
//     try {
//         // Ensure the database connection is established
//         await connectDB();

//         const { messages } = await req.json();
        
//         // Your existing code to process the messages
//         const userMessage = messages[messages.length - 1].content;

//         // Simulate response from a bot (replace this with actual AI call if necessary)
//         const botResponse = `You said: ${userMessage}`;

//         // Save the message to the database
//         const newMessage = new Message({
//             question: userMessage,
//             answer: botResponse,
//         });
//         await newMessage.save();

//         // Return the bot's response
//         return NextResponse.json({ text: botResponse });
//     } catch (error) {
//         console.error("Error handling POST request:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }