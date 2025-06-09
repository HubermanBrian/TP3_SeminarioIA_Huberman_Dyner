import React, { useState } from "react";
import { Chat } from "./chat";
import { sendMessageToAgent } from "./api";

export default function App() {
    const [messages, setMessages] = useState([
        { type: "bot", text: "¡Hola! Soy tu asistente para gestionar estudiantes. ¿Qué necesitás?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { type: "user", text: input };
        setMessages(msgs => [...msgs, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const botResponse = await sendMessageToAgent(input);
            setMessages(msgs => [...msgs, { type: "bot", text: botResponse }]);
        } catch (err) {
            setMessages(msgs => [...msgs, { type: "bot", text: "Ocurrió un error. Intenta de nuevo." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Asistente de Estudiantes</h1>
            <Chat messages={messages} loading={loading} />
            <form className="flex mt-4" onSubmit={handleSend}>
                <input
                    className="flex-1 p-2 border rounded-l"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Escribí tu pregunta..."
                    disabled={loading}
                />
                <button className="bg-blue-500 text-white px-4 rounded-r" type="submit" disabled={loading}>
                    Enviar
                </button>
            </form>
        </div>
    );
}