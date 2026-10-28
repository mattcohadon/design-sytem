import { test, expect } from '@playwright/test';

test('boucle centrale réelle : diff, validation, propagation, recharge, annulation sélective', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Une source. Toutes les vues.' }),
  ).toBeVisible();
  await expect(
    page.getByText('Figma non connecté', { exact: true }),
  ).toBeVisible();
  const catalogue = page.frameLocator('.catalogue-frame');
  await page.locator('.catalogue-frame').scrollIntoViewIfNeeded();
  const mainButton = catalogue
    .locator('#button')
    .getByRole('button', { name: 'Principal', exact: true });
  await expect(mainButton).toHaveCSS(
    'background-color',
    'oklch(0.585 0.233 277.117)',
  );
  await page.getByLabel('Valeur du token').fill('#8A3B20');
  await page.getByRole('button', { name: 'Proposer', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('oklch(0.585 0.233 277.117)');
  await expect(dialog).toContainText('#8A3B20');
  await expect(mainButton).toHaveCSS(
    'background-color',
    'oklch(0.585 0.233 277.117)',
  );
  await dialog.getByRole('button', { name: 'Ne pas appliquer' }).click();
  await expect(mainButton).toHaveCSS(
    'background-color',
    'oklch(0.585 0.233 277.117)',
  );
  await page.getByRole('button', { name: 'Proposer', exact: true }).click();
  await dialog.getByRole('button', { name: 'Valider et enregistrer' }).click();
  await expect(mainButton).toHaveCSS('background-color', 'rgb(138, 59, 32)');
  await page.reload();
  // Les démos du catalogue se montent à l’approche du viewport.
  await page.locator('.catalogue-frame').scrollIntoViewIfNeeded();
  await expect(mainButton).toHaveCSS('background-color', 'rgb(138, 59, 32)');
  await page
    .getByRole('combobox', { name: 'Token', exact: true })
    .selectOption('radius.base');
  await page.getByLabel('Valeur du token').fill('22');
  await page.getByRole('button', { name: 'Proposer', exact: true }).click();
  await dialog.getByRole('button', { name: 'Valider et enregistrer' }).click();
  await page.getByRole('tab', { name: /Historique/ }).click();
  await page
    .getByRole('button', { name: 'Annuler la révision 1', exact: true })
    .click();
  await dialog.getByRole('button', { name: 'Valider et enregistrer' }).click();
  // On revient de l'onglet Historique à la page Tokens.
  await page.getByRole('tab', { name: 'Tokens', exact: true }).click();
  await expect(mainButton).toHaveCSS(
    'background-color',
    'oklch(0.585 0.233 277.117)',
  );
  await expect(mainButton).toHaveCSS('border-top-left-radius', '22px');
  await page.screenshot({ path: 'test-results/studio.png', fullPage: true });
});

test('V2 : Claude est le mode de travail par défaut', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('combobox', { name: 'Mode de travail' }),
  ).toHaveValue('claude');
});

test('V2 : recherche, brouillon récupéré après recharge et abandon sans écriture', async ({
  page,
}) => {
  await page.goto('/');
  const before = await (await page.request.get('/api/state')).json();
  await page.getByLabel('Rechercher un token').fill('radius');
  await expect(
    page.getByText('1 résultat(s).', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('combobox', { name: 'Token', exact: true })
    .selectOption('radius.base');
  await page.getByLabel('Valeur du token').fill('31');
  await expect(
    page.getByText('Brouillon non enregistré.', { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: 'Token', exact: true }),
  ).toHaveValue('radius.base');
  await expect(page.getByLabel('Valeur du token')).toHaveValue('31');
  await expect(
    page.getByText('Brouillon récupéré', { exact: false }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Abandonner le brouillon' }).click();
  await expect(page.getByLabel('Valeur du token')).toHaveValue(
    String(before.tokens['radius.base'].$value),
  );
  expect((await (await page.request.get('/api/state')).json()).revision).toBe(
    before.revision,
  );
});

test('V2 : conflit multi-onglets visible dans le diff, aucune perte de données', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page
    .getByRole('combobox', { name: 'Token', exact: true })
    .selectOption('light.primary');
  await page.getByLabel('Valeur du token').fill('#223355');
  await page.getByRole('button', { name: 'Proposer', exact: true }).click();
  const other = await context.newPage();
  await other.goto('/');
  await other
    .getByRole('combobox', { name: 'Token', exact: true })
    .selectOption('light.primary');
  await other.getByLabel('Valeur du token').fill('#664422');
  await other.getByRole('button', { name: 'Proposer', exact: true }).click();
  await other.getByRole('button', { name: 'Valider et enregistrer' }).click();
  await expect(other.getByRole('dialog')).not.toBeVisible();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('alert')).toContainText('Une autre validation');
  await expect(
    dialog.getByRole('button', { name: 'Valider et enregistrer' }),
  ).toBeDisabled();
  await dialog.getByRole('button', { name: 'Ne pas appliquer' }).click();
  expect(
    (await (await page.request.get('/api/state')).json()).tokens[
      'light.primary'
    ].$value,
  ).toBe('#664422');
  await other.close();
});

test('V2 : capacité de session périmée simulée sans rejeu ambigu', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('heading', { name: 'Tokens sémantiques' }).waitFor();
  const boot = await (await page.request.get('/api/bootstrap')).json();
  // Un seul refus certain avant mutation, comme une capacité périmée après restart.
  let requests = 0;
  await page.route('**/api/proposals', async (route) => {
    requests++;
    if (requests === 1)
      return route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Validation de session manquante. Rechargez la page.',
        }),
      });
    expect(route.request().headers()['x-ds-studio']).toBe(boot.csrf);
    return route.continue();
  });
  await page
    .getByRole('combobox', { name: 'Token', exact: true })
    .selectOption('light.ring');
  await page.getByLabel('Valeur du token').fill('#776622');
  await page.getByRole('button', { name: 'Proposer', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(requests).toBe(2);
  await page.keyboard.press('Escape');
});

test('V2 : clavier, mobile 375 px et absence de stockage navigateur', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Stockage refusé');
    };
    Storage.prototype.getItem = () => {
      throw new DOMException('Stockage refusé');
    };
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('heading', { name: 'Tokens sémantiques' }).waitFor();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Aller aux tokens' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Design System', exact: true }),
  ).toBeFocused();
  await page.getByLabel('Valeur du token').fill('#114477');
  await page.getByRole('button', { name: 'Proposer', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(
    await page.locator('body').evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
});

test('navigation : filtre de la sidebar, page composant, suivant, mode manuel de la barre', async ({
  page,
}) => {
  await page.goto('/');
  // Barre latérale ouverte : la barre Claude reste centrée sur la fenêtre (1600 px).
  const bar = await page
    .locator('form')
    .filter({ has: page.getByLabel('Votre demande') })
    .boundingBox();
  expect(Math.abs(bar!.x + bar!.width / 2 - 800)).toBeLessThan(2);
  await page.getByLabel('Filtrer les composants').fill('dialog');
  await page.getByRole('link', { name: 'Dialog', exact: true }).click();
  await expect(page).toHaveURL(/#\/composants\/dialog$/);
  await expect(
    page.getByRole('heading', { name: 'Dialog', exact: true }),
  ).toBeVisible();
  await expect(
    page.frameLocator('iframe[title="Composant Dialog"]').getByRole('button', {
      name: 'Modifier le profil',
    }),
  ).toBeVisible();
  // Page composant : le composant seul ; l'éditeur de tokens s'affiche à la demande.
  await expect(page.getByLabel('Valeur du token')).toHaveCount(0);
  await page.getByRole('button', { name: 'Tokens', exact: true }).click();
  await expect(page.getByLabel('Valeur du token')).toBeVisible();
  await page.getByRole('link', { name: 'Composant suivant' }).click();
  await expect(page).toHaveURL(/#\/composants\/alert-dialog$/);
  await page
    .getByRole('combobox', { name: 'Mode de travail' })
    .selectOption('manual');
  await expect(page.getByLabel('Votre demande')).toBeDisabled();
  // Arrivée directe sur une page lointaine : son lien est amené dans la barre latérale.
  await page.goto('/?direct=1#/composants/sonner');
  await expect(
    page.getByRole('link', { name: 'Sonner (toast)', exact: true }),
  ).toBeInViewport();
});

test('page composant : spécification Figma issue du snapshot', async ({
  page,
}) => {
  await page.goto('/#/composants/button');
  const spec = page.getByRole('region', { name: 'Spécification Figma' });
  await expect(spec).toContainText('Variant');
  await expect(spec).toContainText('Destructive');
});
