import { useState } from "react";
import Personal from "./components/Personal";
import Lectura from "./components/Lectura";
import Cliente from "./components/Cliente";
import Reservacion from "./components/Reservacion";
import "./App.css";

const App = () => {
  const [component, setComponent] = useState("Personal");

  return (
    <>
      <div className="background"> {/* Aplica la clase de fondo */}
      <div className="flex justify-center space-x-4 my-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setComponent("Personal")}
        >
          PERSONAL
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setComponent("Lectura")}
        >
          LECTURA
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => setComponent("Cliente")}
        >
          CLIENTE
        </button>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={() => setComponent("Reservacion")}
        >
          RESERVACION
        </button>
      </div>
      {component === "Personal" && <Personal />}
      {component === "Lectura" && <Lectura />}
      {component === "Cliente" && <Cliente />}
      {component === "Reservacion" && <Reservacion />}
      </div>
    </>
  );
};

export default App;