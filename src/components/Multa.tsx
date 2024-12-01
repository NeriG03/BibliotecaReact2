import { useEffect, useState } from "react";
import { getMultas } from "../api/httpMulta";

const Multa = () => {
  interface MultaType {
    diasRetraso: number;
    monto: number;
    Reservacion?: {
      Cliente?: {
        nombre: string;
      };
      Recepcionistum?: {
        Personal?: {
          nombre: string;
        };
      };
    };
  }

  const [multas, setMultas] = useState<MultaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMultas()
      .then(response => {
        console.log(response.data);
        
        setMultas(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("Error fetching multas");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold my-4">Multas</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Días de Retraso</th>
            <th className="py-2">Monto</th>
            <th className="py-2">Nombre del Cliente</th>
            <th className="py-2">Nombre del Recepcionista</th>
          </tr>
        </thead>
        <tbody>
          {multas.map((multa, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{multa.diasRetraso}</td>
              <td className="border px-4 py-2">{multa.monto}</td>
              <td className="border px-4 py-2">{multa.Reservacion?.Cliente?.nombre || "N/A"}</td>
              <td className="border px-4 py-2">{multa.Reservacion?.Recepcionistum?.Personal?.nombre || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Multa;