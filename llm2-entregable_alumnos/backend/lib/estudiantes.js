// Gestión de estudiantes
import { readFileSync, writeFileSync } from 'fs';

const DATA_FILE = './data/alumnos.json';

class Estudiantes {
  constructor() {
    this.estudiantes = [];
  }
  
  cargarEstudiantesDesdeJson() {
    try {
        const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
        this.estudiantes = data.alumnos || [];
    } catch (e) {
        console.error("Error al leer el archivo de datos:", e);
    }
  }

  guardarEstudiantes() {
    try {
      writeFileSync(DATA_FILE, JSON.stringify({ alumnos: this.estudiantes }, null, 2));
      this.cargarEstudiantesDesdeJson();
    } catch (e) {
      console.error("Error al guardar los estudiantes:", e);
      throw new Error("No se pudo guardar la lista de estudiantes.");
    }
  }

  // Agrega un nuevo estudiante asegurando que no exista igual (nombre, apellido, curso)
  agregarEstudiante(nombre, apellido, curso) {
    const existe = this.estudiantes.some(
      est =>
        est.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
        est.apellido.trim().toLowerCase() === apellido.trim().toLowerCase() &&
        est.curso.trim().toLowerCase() === curso.trim().toLowerCase()
    );
    if (existe) {
      throw new Error("Ya existe un estudiante con ese nombre, apellido y curso.");
    }
    this.estudiantes.push({ nombre: nombre.trim(), apellido: apellido.trim(), curso: curso.trim() });
    this.guardarEstudiantes();
    return { nombre, apellido, curso };
  }

  // Busca estudiantes por nombre (parcial, insensible a mayúsculas)
  buscarEstudiantePorNombre(nombre) {
    const nombreLower = nombre.trim().toLowerCase();
    return this.estudiantes.filter(est =>
      est.nombre.toLowerCase().includes(nombreLower)
    );
  }

  // Busca estudiantes por apellido (parcial, insensible a mayúsculas)
  buscarEstudiantePorApellido(apellido) {
    const apellidoLower = apellido.trim().toLowerCase();
    return this.estudiantes.filter(est =>
      est.apellido.toLowerCase().includes(apellidoLower)
    );
  }

  // Retorna la lista completa de estudiantes
  listarEstudiantes() {
    return this.estudiantes;
  }
}

export { Estudiantes }

