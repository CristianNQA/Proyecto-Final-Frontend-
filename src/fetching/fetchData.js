import API_URL from "../utils/api";

// Donde hago las peticiones al backend
const fetchData = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token"); // Para leer el token desde el localStorage

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Para agregar el token solo si existe
    },
  };

  if (body) {
    options.body = JSON.stringify(body); // Agregar el body solo si existe
  }

  try {
    // peticion con fetch y concatenacion de API_URL con el endpoin
    const response = await fetch(`${API_URL}/api/${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la petición");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchData:", error);
    return { 
      ok: false, 
      message: error.message 
    };
  }
};

export default fetchData;


