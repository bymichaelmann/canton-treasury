import { useState } from "react";

export function KYC() {
  const [registerForm, setRegisterForm] = useState({
    officer: "",
    investor: "",
    name: "",
    jurisdiction: "",
  });
  const [approveForm, setApproveForm] = useState({
    officer: "",
    contractId: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/compliance/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      setStatusMessage(
        data.contractId
          ? `Investor registered. Contract ID: ${data.contractId}`
          : `Response: ${JSON.stringify(data)}`
      );
    } catch (err) {
      setStatusMessage(`Error: ${(err as Error).message}`);
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/compliance/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(approveForm),
      });
      const data = await res.json();
      setStatusMessage(
        data.contractId
          ? `KYC approved. New Contract ID: ${data.contractId}`
          : `Response: ${JSON.stringify(data)}`
      );
    } catch (err) {
      setStatusMessage(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          KYC / AML Registration
        </h1>
        <p className="mt-2 text-gray-600">
          Register investors and manage compliance status on the Canton ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Register Investor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Register Investor</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Compliance Officer Party ID
              </label>
              <input
                type="text"
                value={registerForm.officer}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, officer: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Investor Party ID
              </label>
              <input
                type="text"
                value={registerForm.investor}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, investor: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Investor Name
              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jurisdiction
              </label>
              <input
                type="text"
                value={registerForm.jurisdiction}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    jurisdiction: e.target.value,
                  })
                }
                placeholder="e.g., US, UK, EU"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-treasury-600 text-white py-2 px-4 rounded-md hover:bg-treasury-700 transition-colors font-medium"
            >
              Register Investor
            </button>
          </form>
        </div>

        {/* Approve KYC */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Approve KYC</h2>
          <form onSubmit={handleApprove} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Compliance Officer Party ID
              </label>
              <input
                type="text"
                value={approveForm.officer}
                onChange={(e) =>
                  setApproveForm({ ...approveForm, officer: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Investor Record Contract ID
              </label>
              <input
                type="text"
                value={approveForm.contractId}
                onChange={(e) =>
                  setApproveForm({ ...approveForm, contractId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Approve KYC
            </button>
          </form>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <p className="text-sm font-mono text-gray-800">{statusMessage}</p>
        </div>
      )}
    </div>
  );
}
