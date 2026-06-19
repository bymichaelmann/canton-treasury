import { useState, useEffect } from "react";

interface Document {
  documentId: string;
  title: string;
  description: string;
  isConfidential: boolean;
  ipfsHash: string;
}

export function DataRoom() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [party, setParty] = useState("Issuer");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/dataroom/documents/${party}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Document[]) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [party]);

  const [createForm, setCreateForm] = useState({
    issuer: "",
    documentId: "",
    title: "",
    description: "",
    ipfsHash: "",
  });
  const [grantForm, setGrantForm] = useState({
    issuer: "",
    documentCid: "",
    investor: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/dataroom/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          isConfidential: true,
        }),
      });
      if (res.ok) {
        // Refresh documents
        const updated = await fetch(`/api/dataroom/documents/${party}`).then(
          (r) => r.json()
        );
        setDocuments(updated);
      }
    } catch (err) {
      console.error("Create document failed:", err);
    }
  };

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/dataroom/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grantForm),
      });
    } catch (err) {
      console.error("Grant access failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Private Data Room</h1>
        <p className="mt-2 text-gray-600">
          Confidential deal room for sharing documents with qualified investors.
          Only authorized parties can view document details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Documents</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Party:</label>
              <input
                type="text"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
              />
            </div>
          </div>
          {loading && <p className="text-gray-500">Loading documents...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <>
              {documents.length === 0 ? (
                <p className="text-gray-500">No documents in the data room.</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.documentId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {doc.description}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            doc.isConfidential
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {doc.isConfidential ? "Confidential" : "Public"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <span className="font-mono">ID: {doc.documentId}</span>
                        <span className="font-mono">
                          IPFS: {doc.ipfsHash}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-6">
          {/* Create Document */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Create Document</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Issuer Party ID"
                value={createForm.issuer}
                onChange={(e) =>
                  setCreateForm({ ...createForm, issuer: e.target.value })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <input
                type="text"
                placeholder="Document ID"
                value={createForm.documentId}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    documentId: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <input
                type="text"
                placeholder="IPFS Hash"
                value={createForm.ipfsHash}
                onChange={(e) =>
                  setCreateForm({ ...createForm, ipfsHash: e.target.value })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-treasury-600 text-white py-2 px-4 rounded-md hover:bg-treasury-700 transition-colors text-sm font-medium"
              >
                Create Document
              </button>
            </form>
          </div>

          {/* Grant Access */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Grant Access</h2>
            <form onSubmit={handleGrant} className="space-y-3">
              <input
                type="text"
                placeholder="Issuer Party ID"
                value={grantForm.issuer}
                onChange={(e) =>
                  setGrantForm({ ...grantForm, issuer: e.target.value })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <input
                type="text"
                placeholder="Document Contract ID"
                value={grantForm.documentCid}
                onChange={(e) =>
                  setGrantForm({
                    ...grantForm,
                    documentCid: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <input
                type="text"
                placeholder="Investor Party ID"
                value={grantForm.investor}
                onChange={(e) =>
                  setGrantForm({ ...grantForm, investor: e.target.value })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-treasury-500 focus:outline-none focus:ring-1 focus:ring-treasury-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Grant Access
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
