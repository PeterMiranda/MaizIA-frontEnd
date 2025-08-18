import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // historial

  const handleUpload = async () => {
    if (!image) return alert("Selecciona una imagen primero");

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      const diagnosis = res.data.final;

      setResult(diagnosis);

      // Guardar en historial con fecha y hora
      const now = new Date();
      const entry = {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        diagnosis,
        imageUrl: URL.createObjectURL(image),
      };

      setHistory([entry, ...history]); // agrega al inicio
    } catch (err) {
      console.error(err);
      setResult("Error al procesar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-green-700 text-white p-4 flex items-center justify-center shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🌽 Detección de Enfermedades en Maíz 🌽
        </h1>
      </header>

      {/* Contenido */}
      <main className="flex flex-col items-center mt-10 w-full">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-lg font-semibold mb-4">
            📸 Sube una foto de la hoja
          </h2>

          {/* Input */}
          <input
            type="file"
            accept="image/*"
            className="mb-4 block w-full text-sm text-gray-600"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* Vista previa */}
          {image && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">Vista previa:</p>
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                className="mt-2 rounded-lg shadow-md w-64 h-64 object-cover mx-auto"
              />
            </div>
          )}

          {/* Botón */}
          <button
            onClick={handleUpload}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            {loading ? "Procesando..." : "Analizar Imagen"}
          </button>

          {/* Resultado */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg shadow-lg text-white ${
                result.includes("Sano") ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <p className="text-lg font-bold">Resultado: {result}</p>
            </div>
          )}
        </div>

        {/* Historial */}
        {history.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">📜 Historial</h3>
            <ul className="space-y-4 max-h-80 overflow-y-auto">
              {history.map((h, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 p-3 border rounded-lg shadow-sm"
                >
                  <img
                    src={h.imageUrl}
                    alt="Historial"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="text-left">
                    <p className="font-bold">
                      {h.diagnosis.includes("Sano") ? "✅ " : "⚠️ "}
                      {h.diagnosis}
                    </p>
                    <p className="text-sm text-gray-600">
                      {h.date} - {h.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 mb-4 text-sm text-gray-600">
        Proyecto IA - Grupo #5 | ESPOL 2025
      </footer>
    </div>
  );
}

export default App;
