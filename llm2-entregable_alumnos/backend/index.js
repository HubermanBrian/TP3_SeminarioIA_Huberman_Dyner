import express from "express";
import cors from "cors";
import morgan from "morgan";
import { elAgente } from "./agent.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });
        const respuesta = await elAgente.run(message);
        res.json({ response: respuesta });
    } catch (err) {
        res.status(500).json({ error: err.message || "Error interno" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});