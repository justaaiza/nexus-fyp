import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Groq } from "groq-sdk";

// Initialize Groq specifically for browser usage (requires dangerouslyAllowBrowser if used in frontend)
// Better to have backend API but using direct for prototype as requested.
const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I can help answer questions about your FYP and general study queries. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant for university students guiding them about Final Year Projects (FYP) and study-related queries. Keep answers concise and helpful." },
          // Include chat history
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage.content }
        ],
        model: "qwen/qwen3-32b",
      });
      
      const rawResponse = chatCompletion.choices?.[0]?.message?.content || "Sorry, I could not process that.";
      // Remove <think>...</think> reasoning blocks from the response
      const responseContent = rawResponse.replace(/<think>[\s\S]*?<\/think>\n*/g, '').trim();
      
      const assistantMessage: Message = { id: Date.now().toString() + "-ai", role: "assistant", content: responseContent };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString() + "-err", role: "assistant", content: "Failed to connect to the assistant. Please ensure your API key is correctly configured." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-[#3b7fe8] text-white rounded-full shadow-xl hover:bg-blue-600 transition-all z-50 flex items-center justify-center animate-bounce-slow"
        aria-label="Open Chatbot"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-100 flex-shrink-0 animate-in slide-in-from-bottom-5">
      <div className="bg-[#3b7fe8] text-white p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <h3 className="font-semibold">FYP Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-[#3b7fe8] text-white rounded-br-sm"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-3 rounded-2xl bg-white border border-slate-200 rounded-bl-sm flex items-center shadow-sm">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3b7fe8]/50 focus:border-[#3b7fe8] transition-all text-sm text-slate-800 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 bg-[#3b7fe8] text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
