
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ROUTES_PRICING } from '../constants';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Namaste! I am your Go Bokaro AI Assistant. Planning a trip from the Steel City today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `
            You are "Steel Buddy", the official AI travel concierge for "Go Bokaro Cabs", based in Bokaro Steel City, Jharkhand.
            Your tone is professional, warm, and helpful. Use "Namaste" and "Ji".
            Core Service Info: 
            - Fleet: Premium Sedans and Maruti Ertiga (7-seaters).
            - Main Routes: ${ROUTES_PRICING.map(r => r.destination).join(', ')}.
            - Pricing data: ${JSON.stringify(ROUTES_PRICING)}.
            - Always remind users that final bookings are made via WhatsApp or by calling 8271212333.
            - Answer questions about local attractions in Bokaro (City Park, Jagannath Temple, Garga Dam) and intercity travel times.
            Keep responses helpful and succinct.
          `
        }
      });

      const aiText = response.text || "I'm having a brief issue connecting. Please call us at 8271212333!";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Namaste! I'm resting. Please call our 24/7 hotline: 8271212333." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-black text-[#A3E635] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-2 border-[#A3E635] group"
        aria-label="Chat with Assistant"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-xl md:text-2xl group-hover:rotate-12 transition-transform`}></i>
      </button>

      {/* Chat Window */}
      <div 
        className={`absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-[380px] h-[550px] max-h-[70vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-black p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#A3E635] flex items-center justify-center relative shadow-lg shadow-lime-500/20">
              <i className="fas fa-robot text-black text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
            </div>
            <div>
              <h4 className="font-black text-sm tracking-tight">Steel Buddy AI</h4>
              <p className="text-[10px] text-lime-400 font-black uppercase tracking-widest">Always Active</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-chevron-down text-xs"></i>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed font-medium shadow-sm ${
                m.role === 'user' 
                ? 'bg-black text-white rounded-tr-none' 
                : 'bg-white border-b-2 border-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1.5">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-3 bg-gray-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-[#A3E635] focus-within:bg-white transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-grow bg-transparent border-none px-3 py-2 text-sm font-bold text-gray-800 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-black text-[#A3E635] w-10 h-10 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-black/10"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
          <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-4">Safe • Secure • Reliable</p>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;
