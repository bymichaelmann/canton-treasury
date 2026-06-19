import { useState, useEffect } from "react";

interface TreasuryBill {
  cusip: string;
  amount: number;
  maturityDate: string;
  coupon: number;
}

export function Dashboard() {
  const [mintForm, setMintForm] = useState({
    issuer: "",
    owner: "",
    amount: "",
    maturityDate: "",
    coupon: "",
    cusip: "",
  });
  const [bills, setBills] = useState<TreasuryBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/treasury/bills")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: TreasuryBill[]) => {
        setBills(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/treasury/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issuer: mintForm.issuer,
          owner: mintForm.owner,
          amount: parseFloat(mintForm.amount),
          maturityDate: mintForm.maturityDate,
          coupon: parseFloat(mintForm.coupon) / 100,
          cusip: mintForm.cusip,
        }),
      });
      if (res.ok) {
        // Refresh the bills list after minting
        const updated = await fetch("/api/treasury/bills").then((r) =>
          r.json()
        );
        setBills(updated);
      }
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issuer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Mint and manage tokenized Treasury Bills on the Canton Network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mint Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Mint T-Bill</h2>
          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issuer Party ID
              </label>
              <input
                type="text"
                value={mintForm.issuer}
                onChange={(e) =>
                  setMintForm({ ...mintForm, issuer: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner Party ID
              </label>
              <input
                type="text"
                value={mintForm.owner}
                onChange={(e) =>
                  setMintForm({ ...mintForm, owner: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Face Value ($)
              </label>
              <input
                type="number"
                value={mintForm.amount}
                onChange={(e) =>
                  setMintForm({ ...mintForm, amount: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maturity Date
                </label>
                <input
                  type="date"
                  value={mintForm.maturityDate}
                  onChange={(e) =>
                    setMintForm({ ...mintForm, maturityDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coupon (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={mintForm.coupon}
                  onChange={(e) =>
                    setMintForm({ ...mintForm, coupon: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CUSIP
              </label>
              <input
                type="text"
                value={mintForm.cusip}
                onChange={(e) =>
                  setMintForm({ ...mintForm, cusip: e.target.value })
                }
                placeholder="e.g., 912828ZJ9"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-treasury-600 text-white py-2 px-4 rounded-md hover:bg-treasury-700 transition-colors font-medium"
            >
              Mint T-Bill
            </button>
          </form>
        </div>

        {/* Issued Bills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Issued T-Bills</h2>
          {loading && (
            <p className="text-gray-500">Loading bills...</p>
          )}
          {error && (
            <p className="text-red-500">Error: {error}</p>
          )}
          {!loading && !error && (
            <div className="space-y-3">
              {bills.length === 0 ? (
                <p className="text-gray-500">No bills issued yet.</p>
              ) : (
                bills.map((bill) => (
                  <div
                    key={bill.cusip}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm text-gray-500">
                          {bill.cusip}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${bill.amount.toLocaleString()}
                        </p>
                      </div>
                      <span className="bg-treasury-100 text-treasury-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {bill.coupon}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Matures: {bill.maturityDate}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
