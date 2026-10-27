// Enregistre le lien Figma et un jeton personnel en lecture dans .ds-studio/figma.json.
// Le jeton est saisi masqué, jamais affiché ni envoyé ailleurs qu'à api.figma.com.
import { createInterface } from 'node:readline';
import { mkdir, writeFile, chmod } from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve(process.env.DS_STUDIO_DATA_DIR ?? '.ds-studio');
const rl = createInterface({ input: process.stdin, output: process.stdout });
let muted = false;
rl._writeToOutput = (s) => {
  if (!muted || s.includes('\n')) process.stdout.write(muted ? '\n' : s);
};
const ask = (q, hidden = false) =>
  new Promise((resolve) => {
    muted = false;
    process.stdout.write(q);
    muted = hidden;
    rl.question('', (a) => resolve(a.trim()));
  });

console.log(
  'Jeton : Figma > Settings > Security > Personal access tokens, droit « file_variables:read » en lecture.',
);
const link = await ask('Lien du fichier Figma (ou sa clé) : ');
const fileKey =
  /figma\.com\/(?:design|file)\/([0-9a-zA-Z]{22,128})/.exec(link)?.[1] ?? link;
if (!/^[0-9a-zA-Z]{22,128}$/.test(fileKey)) {
  console.error('Lien ou clé de fichier Figma invalide. Rien n’a été écrit.');
  process.exit(1);
}
const token = await ask('Jeton personnel Figma (masqué) : ', true);
rl.close();
if (!token) {
  console.error('Jeton vide. Rien n’a été écrit.');
  process.exit(1);
}
await mkdir(dir, { recursive: true, mode: 0o700 });
const file = path.join(dir, 'figma.json');
await writeFile(file, JSON.stringify({ fileKey, token }) + '\n', {
  mode: 0o600,
});
await chmod(file, 0o600);
console.log(
  `Enregistré dans ${path.relative(process.cwd(), file)} (privé, hors Git). Redémarrez DS-Studio puis cliquez « Sync Figma ».`,
);
