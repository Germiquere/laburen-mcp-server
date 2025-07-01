export interface ListDatastoresOptions {
    apiKey:  string;    // API-Key Laburen
    baseUrl: string;    // ej: https://dashboard.laburen.ai
    page?:   number;
    limit?:  number;
  }
  
  export async function listDatastores({
    apiKey,
    baseUrl,
    page,
    limit,
  }: ListDatastoresOptions): Promise<any[]> {
    if (!baseUrl) throw new Error("baseUrl is required");
  
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/api/datastores`);
    if (page)  url.searchParams.set("page",  String(page));
    if (limit) url.searchParams.set("limit", String(limit));
  
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Failed to list datastores – HTTP ${res.status}${
          res.statusText ? `: ${res.statusText}` : ""
        }${body ? ` – ${body}` : ""}`,
      );
    }
  
    return res.json();
  }