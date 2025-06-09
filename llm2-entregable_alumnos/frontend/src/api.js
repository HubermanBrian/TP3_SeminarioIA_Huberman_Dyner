export async function sendMessageToAgent(message) {
    const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Error del servidor");
    const data = await res.json();
    return data.response;
}