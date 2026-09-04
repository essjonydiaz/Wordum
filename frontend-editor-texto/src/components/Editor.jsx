import { useState } from "react";
import "./Editor.css";

// autor llega desde App: es el nombre con el que se inicio sesion
function Editor({ autor }) {
  // Estado del documento: lo que el usuario escribe se guarda aqui
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  // Se recalcula en cada render, cuando cambia el contenido
  const palabras =
    contenido.trim() === "" ? 0 : contenido.trim().split(/\s+/).length;

  const vacio = titulo.trim() === "" && contenido.trim() === "";

  // Por ahora solo lo mostramos en la consola:
  // todavia no hay conexion con Spring Boot
  function guardarDocumento() {
    console.log("Documento:", {
      titulo,
      contenido,
      autor,
    });
  }

  // Arma un archivo .txt en memoria y lo entrega al navegador
  function descargarDocumento() {
    const nombre = titulo.trim() === "" ? "documento" : titulo.trim();

    const texto =
      (titulo.trim() === "" ? "" : titulo + "\n") +
      "Por " + autor + "\n\n" +
      contenido;

    const archivo = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre + ".txt";
    enlace.click();

    // Liberar la memoria que ocupaba el archivo temporal
    URL.revokeObjectURL(url);
  }

  return (
    <section className="editor">
      <input
        type="text"
        className="titulo"
        placeholder="Documento sin título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <p className="firma">
        Por <span>{autor}</span>
      </p>

      <div className="separador"></div>

      <textarea
        className="contenido"
        placeholder="Empieza a escribir…"
        rows="15"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />

      <div className="pie">
        <div className="contadores">
          <span>Caracteres: {contenido.length}</span>
          <span>Palabras: {palabras}</span>
        </div>

        <div className="espacio"></div>

        <button
          className="btn-descargar"
          onClick={descargarDocumento}
          disabled={vacio}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Descargar
        </button>

        <button className="btn-guardar" onClick={guardarDocumento}>
          Guardar
        </button>
      </div>
    </section>
  );
}

export default Editor;
