"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subdomain }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(
          `Tenant created successfully: ${data.name} (${data.subdomain})`
        );
        setName("");
        setSubdomain("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create tenant");
      }
    } catch (error) {
      setError("An error occurred while creating the tenant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
        Welcome to Multitenant App
      </h1>
      <p className="text-lg mb-6 text-gray-600 text-center">
        Create a new tenant to get started.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tenant Name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={subdomain}
            onChange={(e) =>
              setSubdomain(e.target.value.replace(/\s/g, "").toLowerCase())
            }
            placeholder="Subdomain"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white focus:outline-none transition-all duration-200 transform font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700  ${
            isLoading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Create Tenant"
          )}
        </button>
      </form>

      {message && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-700 text-sm">
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 rounded-lg text-red-700 text-sm">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
