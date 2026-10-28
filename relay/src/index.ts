// Pont Figma → GitHub : Figma ne sait pas envoyer l'authentification exigée par l'API GitHub.
export interface Env {
  FIGMA_PASSCODE: string;
  FIGMA_FILE_KEY: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string; // "owner/repo"
}

const sha256 = async (s: string) =>
  new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)),
  );

/** Comparaison à temps constant : on compare les empreintes, de longueur fixe. */
async function same(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

interface Payload {
  event_type?: string;
  file_key?: string;
  passcode?: string;
  timestamp?: string;
  modified_variables?: { name?: string }[];
  created_variables?: { name?: string }[];
  deleted_variables?: { name?: string }[];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST')
      return new Response('Method not allowed', { status: 405 });
    let body: Payload;
    try {
      body = (await request.json()) as Payload;
    } catch {
      return new Response('Bad request', { status: 400 });
    }
    if (!body.passcode || !(await same(body.passcode, env.FIGMA_PASSCODE)))
      return new Response('Forbidden', { status: 403 });
    // Les événements PING et ceux d'autres fichiers sont acquittés sans rien déclencher.
    if (
      body.event_type !== 'LIBRARY_PUBLISH' ||
      body.file_key !== env.FIGMA_FILE_KEY
    )
      return new Response('Ignored', { status: 200 });
    const variables = [
      ...(body.created_variables ?? []),
      ...(body.modified_variables ?? []),
      ...(body.deleted_variables ?? []),
    ]
      .map((v) => v.name)
      .filter(Boolean)
      .join(', ');
    const res = await fetch(
      `https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'figma-sync-relay',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        // Jamais le passcode ni de valeur : seulement les noms de variables.
        body: JSON.stringify({
          event_type: 'figma-publish',
          client_payload: { variables, timestamp: body.timestamp ?? '' },
        }),
      },
    );
    console.log(`dispatch ${res.status}`);
    return new Response(res.ok ? 'OK' : 'Dispatch failed', {
      status: res.ok ? 200 : 502,
    });
  },
};
