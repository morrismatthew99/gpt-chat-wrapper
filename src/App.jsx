import { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.response },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "[Error getting response]" },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl h-[90vh] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 text-white text-xl font-semibold p-4">
          Matthew's AI
        </div>

        {/* Chat messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl max-w-[70%] text-sm bg-gray-200 text-gray-800 italic animate-pulse">
                Matthew’s AI is typing…
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
