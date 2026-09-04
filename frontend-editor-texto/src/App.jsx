import Editor from "./components/Editor";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">E</div>

        <div>
          <h1>Editor de Texto SaaS</h1>
          <p>Mi primer editor construido con React</p>
        </div>

        <span className="insignia">React + Vite</span>
      </header>

      <main>
        <Editor />
      </main>
    </div>
  );
}

export default App;
