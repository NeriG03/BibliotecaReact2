import { useState } from "react";
import Personal from "./components/Personal";
import Lectura from "./components/Lectura";

const App = () => {
  const [component, setComponent] = useState("Personal");

  return (
    <>
      <div className="flex justify-center space-x-4 my-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setComponent("Personal")}
        >
          Personal
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setComponent("Lectura")}
        >
          Lectura
        </button>
      </div>
      {component === "Personal" && <Personal />}
      {component === "Lectura" && <Lectura />}
    </>
  );
};

export default App;