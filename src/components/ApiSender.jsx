import React, { useState } from "react";
import axios from "axios";

const ApiSender = ({ text }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendTextToApi = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://jsonplaceholder.typicode.com/posts", {
        title: text,
        body: text,
        userId: 1,
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to send data to the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-4">
      <h2 className="text-lg font-semibold mb-2">📡 Send Text to API</h2>
      <button
        onClick={sendTextToApi}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send to API"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {response && (
        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          <p><strong>Response ID:</strong> {response.id}</p>
          <p><strong>Title:</strong> {response.title}</p>
          <p><strong>Body:</strong> {response.body}</p>
        </div>
      )}
    </div>
  );
};

export default ApiSender;
