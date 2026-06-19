const CANTON_LEDGER_API = process.env.CANTON_LEDGER_API ?? "http://localhost:5011";

interface CantonRequest {
  commandId: string;
  workflowId?: string;
  parties: string[];
  commands: CantonCommand[];
}

interface CantonCommand {
  exerciseCommand?: {
    templateId: string;
    contractId: string;
    choice: string;
    argument: Record<string, unknown>;
  };
  createCommand?: {
    templateId: string;
    argument: Record<string, unknown>;
  };
}

interface CantonResponse {
  status: "accepted" | "rejected";
  transactionId?: string;
  contractId?: string;
  events?: unknown[];
  error?: string;
}

/**
 * Submit a command to the Canton JSON Ledger API.
 */
export async function submitCommand(
  cmd: CantonRequest
): Promise<CantonResponse> {
  const url = `${CANTON_LEDGER_API}/v1/commands/submit`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Canton API error (${res.status}): ${text}`);
  }
  return res.json() as Promise<CantonResponse>;
}

/**
 * Exercise a choice on an existing contract.
 */
export async function exercise(
  templateId: string,
  contractId: string,
  choice: string,
  argument: Record<string, unknown>,
  parties: string[]
): Promise<CantonResponse> {
  return submitCommand({
    commandId: `cmd-${Date.now()}`,
    parties,
    commands: [
      {
        exerciseCommand: {
          templateId,
          contractId,
          choice,
          argument,
        },
      },
    ],
  });
}

/**
 * Create a new contract.
 */
export async function create(
  templateId: string,
  argument: Record<string, unknown>,
  parties: string[]
): Promise<CantonResponse> {
  return submitCommand({
    commandId: `cmd-${Date.now()}`,
    parties,
    commands: [
      {
        createCommand: {
          templateId,
          argument,
        },
      },
    ],
  });
}
