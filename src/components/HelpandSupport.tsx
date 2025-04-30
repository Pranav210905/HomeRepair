import React, { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Wrench, Paintbrush, Plug, PenTool as Tools, SprayCan as Spray, Settings, Hammer, Fan, Camera, Home, Trees as Tree, Notebook as Robot, Send } from 'lucide-react';

interface Message {
  type: "user" | "bot";
  text: string;
}

export const ChatBot: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("english");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/welcome?language=${language}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Welcome route failed");
        const data = await res.json();
        setMessages([{ type: "bot", text: data.welcome_message }]);
      })
      .catch((err) => {
        console.error("Error fetching welcome message:", err);
        setMessages([{ type: "bot", text: "Welcome! (Default Message)" }]);
      });
  }, [language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, language }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      // Extract the response text from the data object
      const responseText = typeof data.response === 'string' 
        ? data.response 
        : data.response.response || "I couldn't process that request.";
        
      const botMessage: Message = { type: "bot", text: responseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error during /ask:", err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const services = [
    { icon: <Wrench size={24} />, name: "Plumbing" },
    { icon: <Paintbrush size={24} />, name: "Painting" },
    { icon: <Plug size={24} />, name: "Electrical" },
    { icon: <Tools size={24} />, name: "Carpentry" },
    { icon: <Spray size={24} />, name: "Cleaning" },
    { icon: <Settings size={24} />, name: "Appliance Repair" },
    { icon: <Hammer size={24} />, name: "Pest Control" },
    { icon: <Fan size={24} />, name: "AC Services" },
    { icon: <Camera size={24} />, name: "CCTV" },
    { icon: <Home size={24} />, name: "Interior Design" },
    { icon: <Tree size={24} />, name: "Gardening" },
    { icon: <Robot size={24} />, name: "Home Automation" }
  ];

  return (
    <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <h1 className={`text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
            Home Services Virtual Assistant
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Your 24/7 AI-powered assistant for all home services. Get instant information about our services,
            pricing, and availability in multiple Indian languages.
          </p>
        </div>
        
       

        {/* ChatBot Section */}
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                  Chat with Assistant
                </h2>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ask anything about our services
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border border-gray-300 text-gray-900'
                  }`}
                >
                  {[
                    "English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam",
                    "Bengali", "Marathi", "Gujarati", "Punjabi", "Urdu", "Odia",
                    "Assamese", "Sanskrit"
                  ].map((lang) => (
                    <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`h-[400px] overflow-y-auto rounded-xl p-4 mb-4 space-y-4 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`rounded-2xl px-6 py-3 max-w-[80%] ${
                    msg.type === "user"
                      ? `${
                          theme === 'dark' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-orange-100 text-gray-900'
                        }`
                      : `${
                          theme === 'dark'
                            ? 'bg-gray-600 text-white'
                            : 'bg-white text-gray-900'
                        }`
                  }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-6 py-3 ${
                    theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your question..."
                className={`flex-1 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'border border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                <span>Send</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;