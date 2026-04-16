'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Operation = 'listClients' | 'retrieveClient' | 'listCompanies' | 'retrieveCompany';

const OPERATIONS: { value: Operation; label: string; needsId: boolean; idLabel?: string }[] = [
  { value: 'listClients', label: 'List Clients', needsId: false },
  { value: 'retrieveClient', label: 'Get Client', needsId: true, idLabel: 'Client ID' },
  { value: 'listCompanies', label: 'List Companies', needsId: false },
  { value: 'retrieveCompany', label: 'Get Company', needsId: true, idLabel: 'Company ID' },
];

type HistoryEntry = {
  id: string;
  operation: Operation;
  resourceId?: string;
  timestamp: Date;
  duration: number;
  success: boolean;
  response: unknown;
};

export function RequestTester({ token }: { token?: string }) {
  const [loadingOp, setLoadingOp] = useState<Operation | null>(null);
  const [ids, setIds] = useState<Record<string, string>>({});
  const [limits, setLimits] = useState<Record<string, number>>({
    listClients: 5,
    listCompanies: 5,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleRequest = async (op: (typeof OPERATIONS)[number]) => {
    setLoadingOp(op.value);

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: op.value,
          id: op.needsId ? ids[op.value] : undefined,
          token,
          limit: !op.needsId ? (limits[op.value] || 5) : undefined,
        }),
      });

      const data = await res.json();

      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        operation: op.value,
        resourceId: op.needsId ? ids[op.value] : undefined,
        timestamp: new Date(),
        duration: data.duration ?? 0,
        success: data.success,
        response: data.success ? data.data : data.error,
      };

      setHistory((prev) => [entry, ...prev]);
    } catch (error) {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        operation: op.value,
        resourceId: op.needsId ? ids[op.value] : undefined,
        timestamp: new Date(),
        duration: 0,
        success: false,
        response: error instanceof Error ? error.message : 'Request failed',
      };

      setHistory((prev) => [entry, ...prev]);
    } finally {
      setLoadingOp(null);
    }
  };

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">API Request Tester</h2>
        <p className="text-base text-gray-500 mt-1">
          Try out Assembly API requests using the Node SDK
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-2">
                <p className="text-sm text-gray-500 font-medium">
                  Operation
                </p>
              </th>
              <th className="text-left px-4 py-2">
                <p className="text-sm text-gray-500 font-medium">
                  Parameters
                </p>
              </th>
              <th className="px-4 py-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {OPERATIONS.map((op) => (
              <tr key={op.value} className="border-b border-gray-200 last:border-b-0">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">
                    {op.label}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {op.needsId ? (
                    <input
                      type="text"
                      value={ids[op.value] || ''}
                      onChange={(e) =>
                        setIds((prev) => ({ ...prev, [op.value]: e.target.value }))
                      }
                      placeholder={`Paste ${op.idLabel} from list results...`}
                      className="block w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">
                        limit:
                      </p>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={limits[op.value] || 5}
                        onChange={(e) =>
                          setLimits((prev) => ({
                            ...prev,
                            [op.value]: parseInt(e.target.value) || 5,
                          }))
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRequest(op)}
                    disabled={loadingOp !== null || (op.needsId && !ids[op.value])}
                  >
                    {loadingOp === op.value && <Spinner />}
                    Run
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 font-medium">
            Request History
          </p>
          {history.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      entry.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {entry.success ? 'Success' : 'Error'}
                  </span>
                  <p className="text-sm font-medium">
                    {OPERATIONS.find((op) => op.value === entry.operation)?.label}
                    {entry.resourceId && (
                      <span className="text-gray-500 ml-1">({entry.resourceId})</span>
                    )}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {entry.duration}ms
                </p>
              </div>
              <pre className="p-4 text-xs overflow-auto max-h-64 bg-gray-900 text-gray-100">
                {JSON.stringify(entry.response, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
