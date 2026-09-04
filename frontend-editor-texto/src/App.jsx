import { useState } from "react";
import Login from "./components/Login";
import Editor from "./components/Editor";
import "./App.css";

const CLAVE_USUARIO = "editor-react-usuario";

// El navegador puede bloquear localStorage (ventana privada), asi que se protege
function leerUsuario() {
  try {
    return localStorage.getItem(CLAVE_USUARIO);
  } catch (e) {
    return null;
  }
}

function App() {
  // App es quien guarda el estado de la sesion, porque afecta a toda la pagina
  const [usuario, setUsuario] = useState(leerUsuario);

  function entrar(nombre) {
    try {
      localStorage.setItem(CLAVE_USUARIO, nombre);
    } catch (e) {
      // Sin almacenamiento la sesion dura mientras la pagina este abierta
    }
    setUsuario(nombre);
  }

  function salir() {
    try {
      localStorage.removeItem(CLAVE_USUARIO);
    } catch (e) {
      // Nada que limpiar si el navegador no permitio guardar
    }
    setUsuario(null);
  }

  // Mientras no haya sesion, lo unico que se muestra es la pantalla de acceso
  if (!usuario) {
    return <Login onEntrar={entrar} />;
  }

  return (
    <div className="app">
      <header className="barra-superior">
        <div className="logo">E</div>
        <h1>Editor de Texto SaaS</h1>

        <span className="insignia">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97 6 6 0 0 0-11.6-1.5A4.5 4.5 0 0 0 6.5 19h11z" />
          </svg>
          Cómputo en la nube
        </span>

        <div className="espacio"></div>

        <div className="usuario">
          <span className="inicial">{usuario.charAt(0).toUpperCase()}</span>
          <span className="nombre">{usuario}</span>
          <button className="btn-salir" onClick={salir}>Salir</button>
        </div>
      </header>

      <main className="contenido-principal">
        <Editor autor={usuario} />
      </main>
    </div>
  );
}

export default App;
