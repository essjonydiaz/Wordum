import Editor from "./components/Editor";
import "./App.css";

function App() {
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

        <p className="subtitulo">Mi primer editor construido con React</p>
      </header>

      <main className="contenido-principal">
        <Editor />
      </main>
    </div>
  );
}

export default App;
