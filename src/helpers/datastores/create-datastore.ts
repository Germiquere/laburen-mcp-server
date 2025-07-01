// ──────────────────────────────────────────────────────────────
//  createDatastore  ––  POST /api/datastores
// ──────────────────────────────────────────────────────────────

import { CreateDatastoreRequestSchema } from "../../schemas";


export interface CreateDatastoreOptions {
  /** API-Key que se envía en el header Authorization: Bearer <key> */
  apiKey : string;
  /** URL base del dashboard, p. ej. https://dashboard.laburen.ai */
  baseUrl: string;
  /** Datos validados con CreateDatastoreInputSchema */
  data   : CreateDatastoreRequestSchema;
}

export async function createDatastore({
  apiKey,
  baseUrl,
  data,
}: CreateDatastoreOptions): Promise<any> {
  if (!baseUrl) throw new Error('baseUrl is required');

  const url = `${baseUrl.replace(/\/$/, '')}/api/datastores`;

  const res = await fetch(url, {
    method : 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Failed to create datastore – HTTP ${res.status}` +
      `${res.statusText ? `: ${res.statusText}` : ''}` +
      `${body ? ` – ${body}` : ''}`,
    );
  }

  return res.json();
}