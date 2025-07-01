// helpers/deleteAgent.ts
export interface DeleteAgentOptions {
    /** ID (o handle, con o sin @) del agente */
    agentId: string;
    /** API-Key generada en Laburen */
    apiKey: string;
    /** URL base del dashboard (e.g. https://dashboard.laburen.ai) */
    baseUrl: string;
  }
  
  export async function deleteAgentById({
    agentId,
    apiKey,
    baseUrl,
  }: DeleteAgentOptions): Promise<void> {
    if (!baseUrl) throw new Error("baseUrl is required");
  
    const url = `${baseUrl.replace(/\/$/, "")}/api/agents/${agentId.replace(
      /^@/,
      "",
    )}`;
  
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Failed to delete agent ${agentId} – HTTP ${res.status}${
          res.statusText ? `: ${res.statusText}` : ""
        }${body ? ` – ${body}` : ""}`,
      );
    }
  }