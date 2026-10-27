import { useEffect, useState, type ChangeEvent } from 'react';
import { DownloadIcon, RotateCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProjectSnapshot } from '../shared/project.js';
import { downloadText, request } from './api.js';

const fields = [
  ['name', 'Nom du PFE', 100],
  ['audience', 'Public concerné', 1000],
  ['goal', 'Objectif et critères de réussite', 2000],
  ['figmaUrl', 'Lien Figma (facultatif)', 500],
] as const;

export default function ProjectBrief() {
  const [snapshot, setSnapshot] = useState<ProjectSnapshot>();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      setSnapshot(await request('project'));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <div className="grid gap-3">
      <p className="text-xs text-muted-foreground">
        Votre contexte, stocké sur ce poste, hors Git. Le lien Figma est un
        repère, pas une synchronisation.
      </p>
      {error && (
        <p role="alert" className="text-xs text-destructive-foreground">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-xs text-muted-foreground">
          {notice}
        </p>
      )}
      {snapshot && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError('');
            setNotice('');
            try {
              setSnapshot(await request('project', snapshot));
              setNotice('Brief enregistré sur ce poste.');
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <FieldGroup className="gap-3">
            {fields.map(([key, label, max]) => {
              const props = {
                id: `brief-${key}`,
                maxLength: max,
                value: snapshot.project[key],
                disabled: busy,
                onChange: (
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                ) =>
                  setSnapshot({
                    ...snapshot,
                    project: { ...snapshot.project, [key]: e.target.value },
                  }),
              };
              return (
                <Field key={key}>
                  <FieldLabel htmlFor={props.id}>{label}</FieldLabel>
                  {key === 'goal' || key === 'audience' ? (
                    <Textarea rows={3} {...props} />
                  ) : (
                    <Input
                      type={key === 'figmaUrl' ? 'url' : 'text'}
                      {...props}
                    />
                  )}
                </Field>
              );
            })}
            <Button type="submit" disabled={busy} className="w-fit">
              {busy ? 'Enregistrement…' : 'Enregistrer le brief'}
            </Button>
          </FieldGroup>
        </form>
      )}
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={() => void load()}
        >
          <RotateCwIcon data-icon="inline-start" />
          Recharger le brief
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy || !snapshot}
          onClick={() => {
            void request<ProjectSnapshot>('project')
              .then(({ project: p }) => {
                downloadText(
                  'PFE-brief.md',
                  `# ${p.name || 'Mon PFE'}\n\n## Public\n\n${p.audience}\n\n## Objectif\n\n${p.goal}\n\n## Repère Figma (sans connexion)\n\n${p.figmaUrl}\n`,
                );
              })
              .catch((e) => setError(e.message));
          }}
        >
          <DownloadIcon data-icon="inline-start" />
          Exporter le brief enregistré (.md)
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Avec Codex, ce brief rejoint le contexte envoyé au fournisseur : pas de
        données sensibles. Pour votre agent externe, reportez vos choix dans
        workspace/PFE.md après relecture.
      </p>
    </div>
  );
}
