import { useState } from "react";
import "./Login.css";

// Recibe de App la funcion que se ejecuta cuando el usuario entra
function Login({ onEntrar }) {
  const [nombre, setNombre] = useState("");

  // El boton solo se habilita cuando hay algo escrito
  const listo = nombre.trim() !== "";

  function manejarEnvio(e) {
    e.preventDefault();
    if (!listo) return;
    onEntrar(nombre.trim());
  }

  return (
    <div className="pantalla-acceso">
      <form className="tarjeta-acceso" onSubmit={manejarEnvio} autoComplete="off">
        <div className="logo-grande">E</div>

        <h1>Editor de Texto SaaS</h1>
        <p className="bienvenida">
          Escribe tu nombre para entrar.
          <br />
          Los documentos que escribas quedarán firmados con él.
        </p>

        <div className="campo-acceso">
          <label htmlFor="nombre">Tu nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder="Escribe tu nombre…"
            maxLength="60"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
        </div>

        <button type="submit" className="btn-entrar" disabled={!listo}>
          Entrar al editor
        </button>

        <p className="nota-acceso">
          No se pide contraseña: esta pantalla identifica a quien escribe
          dentro de la aplicación.
        </p>
      </form>
    </div>
  );
}

export default Login;
