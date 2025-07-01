// ───────────────────────────────────────────────────────────────
//  updateAgentById – PATCH /api/agents/:id (sin localhost por defecto)
// ───────────────────────────────────────────────────────────────
export interface UpdateAgentOptions {
    /** ID (o handle, con o sin @) del agente */
    agentId: string;
    /** API-Key generada en Laburen; se enviará como `Authorization: Bearer <key>` */
    apiKey: string;
    /** URL base del dashboard, p.e. https://dashboard.laburen.ai  */
    baseUrl: string;
    /** Objeto con los campos a actualizar */
    data: Record<string, any>;
  }
  
  export async function updateAgentById({
    agentId,
    apiKey,
    baseUrl,
    data,
  }: UpdateAgentOptions): Promise<any> {
    if (!baseUrl) throw new Error("baseUrl is required");
    console.log("baseUrl", baseUrl);
    const url = `${baseUrl.replace(/\/$/, "")}/api/agents/${agentId.replace(
      /^@/,
      "",
    )}`;
  
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("res", res);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.log("body", body);
      throw new Error(
        `Failed to update agent ${agentId} – HTTP ${res.status}${
          res.statusText ? `: ${res.statusText}` : ""
        }${body ? ` – ${body}` : ""}`,
      );
    }
  
    return res.json();
  }