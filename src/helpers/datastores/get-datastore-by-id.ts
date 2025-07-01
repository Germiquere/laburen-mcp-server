// ───────────────────────────────────────────────────────────────
//  getDatastoreById – GET /api/datastores/:id   (sin localhost)
// ───────────────────────────────────────────────────────────────
export interface GetDatastoreOptions {
    /** ID del datastore a consultar */
    datastoreId : string;
    /** API-Key de Laburen: se envía como `Authorization: Bearer <key>` */
    apiKey      : string;
    /** URL base del dashboard, p.e. https://dashboard.laburen.ai */
    baseUrl     : string;
  }
  
  export async function getDatastoreById({
    datastoreId,
    apiKey,
    baseUrl,
  }: GetDatastoreOptions): Promise<any> {
    if (!baseUrl) throw new Error("baseUrl is required");
  
    const url = `${baseUrl.replace(/\/$/, "")}/api/datastores/${datastoreId}`;
  
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Failed to fetch datastore ${datastoreId} – HTTP ${res.status}` +
          `${res.statusText ? `: ${res.statusText}` : ""}` +
          `${body ? ` – ${body}` : ""}`,
      );
    }
  
    return res.json();
  }