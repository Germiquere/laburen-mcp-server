// ──────────────────────────────────────────────────────────────
//  updateDatastoreById  ––  PATCH /api/datastores/:id
// ──────────────────────────────────────────────────────────────
import { UpdateDatastoreRequestSchema } from "../../schemas";

export interface UpdateDatastoreOptions {
  /** ID del datastore a actualizar */
  datastoreId: string;
  /** API-Key generada en Laburen; se envía como `Authorization: Bearer <key>` */
  apiKey: string;
  /** URL base del dashboard, p. ej. https://dashboard.laburen.ai */
  baseUrl: string;
  /** Datos validados con UpdateDatastoreRequestSchema */
  data: UpdateDatastoreRequestSchema;
}

export async function updateDatastoreById({
  datastoreId,
  apiKey,
  baseUrl,
  data,
}: UpdateDatastoreOptions): Promise<any> {
  if (!baseUrl) throw new Error("baseUrl is required");

  const url = `${baseUrl.replace(/\/$/, '')}/api/datastores/${datastoreId}`;

  const payload = { id: datastoreId, ...data } as any;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    
    const body = await res.text().catch(() => '');
    
    throw new Error(
      `Failed to update datastore ${datastoreId} – HTTP ${res.status}` +
        `${res.statusText ? `: ${res.statusText}` : ''}` +
        `${body ? ` – ${body}` : ''}`,
    );
  }

  return res.json();
} 