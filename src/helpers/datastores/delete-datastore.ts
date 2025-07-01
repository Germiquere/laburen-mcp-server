// ───────────────────────────────────────────────────────────────
//  deleteDatastoreById – DELETE /api/datastores/:id
// ───────────────────────────────────────────────────────────────
export interface DeleteDatastoreOptions {
    /** ID del datastore a eliminar */
    datastoreId : string;
    /** API-Key generada en Laburen; se envía como `Authorization: Bearer <key>` */
    apiKey      : string;
    /** URL base del dashboard, p.e. https://dashboard.laburen.ai */
    baseUrl     : string;
  }
  
  export async function deleteDatastoreById({
    datastoreId,
    apiKey,
    baseUrl,
  }: DeleteDatastoreOptions): Promise<void> {
    if (!baseUrl) throw new Error("baseUrl is required");
  
    const url = `${baseUrl.replace(/\/$/, "")}/api/datastores/${datastoreId}`;
  
    const res = await fetch(url, {
      method : "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Failed to delete datastore ${datastoreId} – HTTP ${res.status}` +
          `${res.statusText ? `: ${res.statusText}` : ""}` +
          `${body ? ` – ${body}` : ""}`,
      );
    }
  }