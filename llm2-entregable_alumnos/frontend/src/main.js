import { tool, agent } from "llamaindex";
import { Ollama } from "@llamaindex/ollama";
import { z } from "zod";
import { empezarChat } from "../../backend/lib/cli-chat.js";
import { Estudiantes } from "../../backend/lib/estudiantes.js";

// Configuración
const DEBUG = true;

// Instancia de la clase Estudiantes
const estudiantes = new Estudiantes();
estudiantes.cargarEstudiantesDesdeJson();

// System prompt básico
const systemPrompt = `
Sos un asistente para gestionar estudiantes.
Tu tarea es ayudar a consultar o modificar una base de datos de alumnos.

Usá las herramientas disponibles para:
- Buscar estudiantes por nombre o apellido
- Agregar nuevos estudiantes
- Mostrar la lista completa de estudiantes

Respondé de forma clara y breve.
`.trim();

const ollamaLLM = new Ollama({
    model: "qwen3:1.7b",
    temperature: 0.75,
    timeout: 2 * 60 * 1000, // Timeout de 2 minutos
});

// Tool para buscar por nombre
const buscarPorNombreTool = tool({
    name: "buscarPorNombre",
    description: "Usa esta función para encontrar estudiantes por su nombre",
    parameters: z.object({
        nombre: z.string().describe("El nombre del estudiante a buscar"),
    }),
    execute: ({ nombre }) => {
        const encontrados = estudiantes.buscarEstudiantePorNombre(nombre);
        if (encontrados.length === 0) {
            return `No se encontraron estudiantes con el nombre "${nombre}".`;
        }
        return encontrados.map(e => `${e.nombre} ${e.apellido} (${e.curso})`).join('\n');
    },
});

// Tool para buscar por apellido
const buscarPorApellidoTool = tool({
    name: "buscarPorApellido",
    description: "Usa esta función para encontrar estudiantes por su apellido",
    parameters: z.object({
        apellido: z.string().describe("El apellido del estudiante a buscar"),
    }),
    execute: ({ apellido }) => {
        const encontrados = estudiantes.buscarEstudiantePorApellido(apellido);
        if (encontrados.length === 0) {
            return `No se encontraron estudiantes con el apellido "${apellido}".`;
        }
        return encontrados.map(e => `${e.nombre} ${e.apellido} (${e.curso})`).join('\n');
    },
});

// Tool para agregar estudiante
const agregarEstudianteTool = tool({
    name: "agregarEstudiante",
    description: "Usa esta función para agregar un nuevo estudiante",
    parameters: z.object({
        nombre: z.string().describe("El nombre del estudiante"),
        apellido: z.string().describe("El apellido del estudiante"),
        curso: z.string().describe("El curso del estudiante (ej: 4A, 4B, 5A)"),
    }),
    execute: ({ nombre, apellido, curso }) => {
        try {
            estudiantes.agregarEstudiante(nombre, apellido, curso);
            return `Estudiante agregado: ${nombre} ${apellido} (${curso})`;
        } catch (e) {
            return `No se pudo agregar el estudiante: ${e.message}`;
        }
    },
});

// Tool para listar estudiantes
const listarEstudiantesTool = tool({
    name: "listarEstudiantes",
    description: "Usa esta función para mostrar todos los estudiantes",
    parameters: z.object({}),
    execute: () => {
        const lista = estudiantes.listarEstudiantes();
        if (lista.length === 0) {
            return "No hay estudiantes registrados.";
        }
        return lista.map(e => `${e.nombre} ${e.apellido} (${e.curso})`).join('\n');
    },
});

// Configuración del agente
const elAgente = agent({
    tools: [buscarPorNombreTool, buscarPorApellidoTool, agregarEstudianteTool, listarEstudiantesTool],
    llm: ollamaLLM,
    verbose: DEBUG,
    systemPrompt: systemPrompt,
});

// Mensaje de bienvenida
const mensajeBienvenida = `
¡Hola! Soy tu asistente para gestionar estudiantes.
Puedo ayudarte a:
- Buscar estudiantes por nombre o apellido
- Agregar nuevos estudiantes
- Mostrar la lista completa de estudiantes

¿Qué necesitás?
`;

// Iniciar el chat
empezarChat(elAgente, mensajeBienvenida);

