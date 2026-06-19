import { useState, useEffect } from "react";

interface Holding {
  cusip: string;
  amount: number;
  maturityDate: string;
  coupon: number;
  contractId: string;
}

export function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/treasury/bills")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Holding[]) => {
        setHoldings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const [transferForm, setTransferForm] = useState({
    contractId: "",
    newOwner: "",
    restrictionCid: "",
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/treasury/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferForm),
      });
      if (res.ok) {
        // Refresh holdings after transfer
        const updated = await fetch("/api/treasury/bills").then((r) =>
          r.json()
        );
        setHoldings(updated);
      }
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
        <p className="mt-2 text-gray-600">
          Your tokenized T-Bill holdings. Send or receive tokens with
          compliance checks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Holdings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Holdings</h2>
          {loading && <p className="text-gray-500">Loading holdings...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <>
              {holdings.length === 0 ? (
                <p className="text-gray-500">No holdings yet.</p>
              ) : (
                <div className="space-y-3">
                  {holdings.map((h) => (
                    <div
                      key={h.contractId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-sm text-gray-500">
                            {h.cusip}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${h.amount.toLocaleString()}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          {h.coupon}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Matures: {h.maturityDate}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        CID: {h.contractId}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Transfer Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Transfer T-Bill</h2>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contract ID
              </label>
              <input
                type="text"
                value={transferForm.contractId}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    contractId: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Owner Party ID
              </label>
              <input
                type="text"
                value={transferForm.newOwner}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    newOwner: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Restriction Contract ID
              </label>
              <input
                type="text"
                value={transferForm.restrictionCid}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    restrictionCid: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Transfer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
