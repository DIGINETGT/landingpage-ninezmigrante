import { useEffect, useState } from "react";

/* Una constante que se utiliza para traducir la identificación del trimestre a un nombre de trimestre. */
export const quarters = {
  q1: "Primer cuatrimestre",
  q2: "Segundo cuatrimestre",
  q3: "Tercer cuatrimestre",
};

export const quarterId = {
  q1: "enero - abril",
  q2: "mayo - agosto",
  q3: "septiembre - diciembre",
};

/**
 * Obtiene datos de una API y devuelve un estado de carga y un estado de error
 * @returns un objeto con dos propiedades: carga y error.
 */
const useFetch = ({
  url = "",
  year = "",
  period = "",
  country = "",
  department = "",
  resolve = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // EJECUTAR FETCH CUANDO EL COMPONENTE SE CARGA
  useEffect(() => {
    // FETCH
    const getData = async () => {
      // CARGANDO
      setLoading(true);

      try {
        // RESPUESTA COMO JSON
        if (url.length) {
          const response = await fetch(
            `${import.meta.env.VITE_APP_API_URL}${url}`
              .replaceAll("country", country)
              .replaceAll("year", year)
              .replaceAll("department", encodeURI(department))
              .replaceAll("quarter", encodeURI(quarterId[period]))
          );
          const json = await response.json();
          resolve(json);
        }
      } catch (error) {
        console.log(error);
        setError(error);
      }

      // CARGA FINALIZADA
      setLoading(false);
    };

    getData();
  }, [url, year, period, country, department]);

  return { loading, error };
};

export default useFetch;
