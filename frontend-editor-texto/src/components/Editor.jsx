import { useState } from "react";
import "./Editor.css";

function Editor() {
  // Estado del documento: lo que el usuario escribe se guarda aqui
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  // Se recalcula solo en cada render, cuando cambia el contenido
  const palabras =
    contenido.trim() === "" ? 0 : contenido.trim().split(/\s+/).length;

  // Por ahora solo lo mostramos en la consola:
  // todavia no hay conexion con Spring Boot
  function guardarDocumento() {
    console.log("Documento:", {
      titulo,
      contenido,
    });
  }

  return (
    <section className="editor">
      <h2>Documento</h2>

      <input
        type="text"
        placeholder="Título del documento"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <p className="dato">Título actual: {titulo}</p>

      <textarea
        placeholder="Escribe aquí..."
        rows="15"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />

      <p className="dato">Caracteres: {contenido.length}</p>
      <p className="dato">Palabras: {palabras}</p>

      <button onClick={guardarDocumento}>Guardar</button>
    </section>
  );
}

export default Editor;
