import React from "react";

export function Chat({ messages, loading }) {
    return (
        <div className="flex flex-col space-y-2 p-4 bg-gray-50 rounded h-[400px] overflow-y-auto border">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded px-3 py-2 max-w-xs ${msg.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="rounded px-3 py-2 bg-gray-200 text-gray-400 animate-pulse">Pensando...</div>
                </div>
            )}
        </div>
    );
}