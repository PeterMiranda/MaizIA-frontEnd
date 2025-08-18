import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return alert("Selecciona una imagen primero");

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res)
      setResult(res.data.final);
    } catch (err) {
      console.error(err);
      setResult("Error al procesar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Detección de Enfermedades en Maíz</h1>

      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
      >
        {loading ? "Procesando..." : "Analizar"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
          <p className="text-lg">Resultado: <b>{result}</b></p>
        </div>
      )}
    </div>
  );
}

export default App;
