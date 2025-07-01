// ───────────────────────────────────────────────────────────────
//  createAgent – POST /api/agents           (NO fallback localhost)
// ───────────────────────────────────────────────────────────────
export interface CreateAgentOptions {
    /** API-Key generada en Laburen */
    apiKey: string;
    /** URL base del dashboard, e.g. https://dashboard.laburen.ai */
    baseUrl: string;
    /** Datos del nuevo agente (CreateAgentInputSchema) */
    data: Record<string, any>;
  }
  
  export async function createAgent({
    apiKey,
    baseUrl,
    data,
  }: CreateAgentOptions): Promise<any> {
    if (!baseUrl) throw new Error("baseUrl is required");
  
    const url = `${baseUrl.replace(/\/$/, "")}/api/agents`;
  console.log(JSON.stringify(data));
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Failed to create agent – HTTP ${res.status}${
          res.statusText ? `: ${res.statusText}` : ""
        }${body ? ` – ${body}` : ""}`,
      );
    }
  
    return res.json();
  }