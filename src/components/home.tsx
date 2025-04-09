"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none   transition-all duration-200 transform cursor-pointer font-semibold"
          >
            Create Tenant
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-700">
            <h2 className="font-semibold">Success</h2>
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 rounded-lg text-red-700">
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
