export interface GetAgentOptions {
  /** ID (o handle, con o sin @) del agente */
  agentId: string;
  /** Origen del dashboard – por defecto localhost si estás en dev */
  baseUrl?: string;
  /** API-Key generada en Laburen; se enviará como `Authorization: Bearer <key>` */
  apiKey: string;
}

/**
 *
 * Ejemplo de uso:
 *   const agent = await getAgentById({ agentId: 'clnq...', apiKey: MY_KEY });
 */
export async function getAgentById({
  agentId,
  apiKey,
  baseUrl,
}: GetAgentOptions): Promise<any> {
  const url = `${baseUrl!.replace(/\/$/, '')}/api/agents/${agentId.replace(/^@/, '')}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    method: 'GET',
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Failed to fetch agent ${agentId} – HTTP ${res.status}${res.statusText ? `: ${res.statusText}` : ''}${body ? ` – ${body}` : ''}`,
    );
  }

  return res.json();
}