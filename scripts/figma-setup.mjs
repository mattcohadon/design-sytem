// Enregistre le lien Figma et un jeton personnel en lecture dans .ds-studio/figma.json.
// Le jeton n'est jamais affiché ni envoyé ailleurs qu'à api.figma.com.
//
//   pbpaste | npm run figma:setup -- "<lien du fichier>"   jeton lu depuis le presse-papiers
//   npm run figma:setup                                     saisie interactive (jeton masqué)
import { createInterface } from 'node:readline';
import { mkdir, writeFile, chmod } from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve(process.env.DS_STUDIO_DATA_DIR ?? '.ds-studio');
const fail = (message) => {
  console.error(message);
  process.exit(1);
};
const keyOf = (link) =>
  /figma\.com\/(?:design|file)\/([0-9a-zA-Z]{22,128})/.exec(link)?.[1] ?? link;

let link = process.argv[2] ?? '';
let token = '';
if (!process.stdin.isTTY) {
  // Jeton fourni sur l'entrée standard (ex. pbpaste) : rien à taper, rien dans l'historique.
  for await (const chunk of process.stdin) token += chunk;
  token = token.replace(/\x1b\[[0-9;]*[~A-Za-z]/g, '').trim();
} else {
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
  if (!link) link = await ask('Lien du fichier Figma (ou sa clé) : ');
  token = await ask('Jeton personnel Figma (masqué) : ', true);
  rl.close();
}
const fileKey = keyOf(link);
if (!/^[0-9a-zA-Z]{22,128}$/.test(fileKey))
  fail('Lien ou clé de fichier Figma invalide. Rien n’a été écrit.');
if (!token)
  fail(
    'Jeton vide. Copiez le jeton (Cmd+C) puis lancez : pbpaste | npm run figma:setup -- "<lien>". Rien n’a été écrit.',
  );
await mkdir(dir, { recursive: true, mode: 0o700 });
const file = path.join(dir, 'figma.json');
await writeFile(file, JSON.stringify({ fileKey, token }) + '\n', {
  mode: 0o600,
});
await chmod(file, 0o600);
console.log(
  `Enregistré : ${file} (fichier ${fileKey}, jeton de ${token.length} caractères, privé, hors Git). Redémarrez Stride UI puis cliquez « Sync Figma ».`,
);
