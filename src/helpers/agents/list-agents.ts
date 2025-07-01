// helpers/listAgents.ts
export interface ListAgentsOptions {
    apiKey:  string;           // API-Key Laburen
    baseUrl: string;           // p.e. https://dashboard.laburen.ai
    page?:   number;
    limit?:  number;
  }
  
  export async function listAgents({
    apiKey,
    baseUrl,
    page,
    limit,
  }: ListAgentsOptions): Promise<any[]> {
    if (!baseUrl) throw new Error("baseUrl is required");
  
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/api/agents`);
    if (page)  url.searchParams.set("page",  String(page));
    if (limit) url.searchParams.set("limit", String(limit));
  
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Failed to list agents – HTTP ${res.status}${
          res.statusText ? `: ${res.statusText}` : ""
        }${body ? ` – ${body}` : ""}`,
      );
    }
  
    return res.json();
  }