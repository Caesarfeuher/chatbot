"use client";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import Textarea from "react-textarea-autosize";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { formatDistanceToNow, parseISO } from "date-fns";

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

// Define your component
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load messages from local storage on initial render
    const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(storedMessages);
    scrollToBottom();
  }, []);

  useEffect(() => {
    // Save messages to local storage whenever messages state changes
    localStorage.setItem("messages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  // Handle input change
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { 
      role: "user", 
      content: input.trim(), 
      timestamp: new Date().toISOString() 
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setInput("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the response from the server");
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: data.text, timestamp: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages");
  };

  // Helper function to format date labels
  const formatDateLabel = (date: string) => {
    const parsedDate = parseISO(date);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo <= 3) return `${daysAgo} days ago`;
    if (daysAgo <= 10) return `${daysAgo} days ago`;
    if (daysAgo <= 30) return `${daysAgo} days ago`;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  // Return JSX structure
  return (
    <div className="flex min-h-screen bg-neutral-800">
      <div className="relative">
        <div
          className={`flex flex-col ${
            isSidebarOpen ? "w-64" : "w-0"
          } bg-black min-h-screen transition-all duration-300 overflow-hidden`}
        >
          <div className="flex justify-between items-center p-2">
            <ViewSidebarIcon
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white cursor-pointer"
              fontSize="large"
            />
            {isSidebarOpen && (
              <RateReviewIcon
                className="text-white cursor-pointer"
                fontSize="large"
                onClick={clearMessages}
              />
            )}
          </div>
          {isSidebarOpen && (
            <>
              {/* <h2 className="text-white text-xl mb-4 px-4">History</h2> */}
              <div className="px-4">
                {messages.length ? (
                  messages.map((message, index) => (
                    <div key={index} className="mb-2">
                      {message.role === "user" && (
                        <>
                          {(index === 0 ||
                            formatDateLabel(messages[index - 1].timestamp) !==
                              formatDateLabel(message.timestamp)) && (
                            <div className="py-2">
                              <p className="text-sm text-gray-500 pl-8">
                                {formatDateLabel(message.timestamp)}
                              </p>
                            </div>
                          )}
                          <p className="text-sm text-gray-400">
                            {message.content.length > 45
                              ? `${message.content.substring(0, 42)}...`
                              : message.content}
                          </p>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No history available</p>
                )}
              </div>
            </>
          )}
        </div>
        {!isSidebarOpen && (
          <ViewSidebarIcon
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white cursor-pointer absolute top-4 left-4"
            fontSize="large"
          />
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex-1 pb-5 pt-5 space-y-5 overflow-y-auto px-4">
          {messages.length ? (
            messages.map((message, index) => (
              <div key={index} className="w-full flex justify-center">
                <div
                  className={`flex gap-x-2 max-w-xl w-full ${
                    message.role === "user" ? "" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-lg ${
                      message.role === "user" ? "bg-gray-500" : "bg-teal-500"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full text-white p-1"
                    >
                      <path d="M16.5 7.5h-9v9h9v-9z" />
                      <path
                        fillRule="evenodd"
                        d={`M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75z`}
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <p
                      className={`rounded-lg p-3 text-sm break-words ${
                        message.role === "user"
                          ? "border-gray-500 bg-gray-700 text-white"
                          : "border-teal-500 bg-teal-700 text-white"
                      } border-2`}
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center items-center h-full">
              <h1 className="font-bold text-3xl text-white">
                Please use the input field below ⬇️
              </h1>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-5">
           <div className="relative flex items-center justify-center gap-5">
             <Textarea
              id="messageInput"
              tabIndex={0}
              required
              rows={1}
              value={input}
              onChange={handleInputChange}
              autoFocus
              placeholder="Send message..."
              spellCheck={false}
              className="w-3/4 focus:outline-none shadow-teal-700 shadow-xl placeholder:text-gray-200 text-sm text-white p-5 pr-16 rounded-xl bg-neutral-600"
            />
            <button type="submit" className="relative bg-teal-500 p-2 rounded-lg ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 text-white"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


