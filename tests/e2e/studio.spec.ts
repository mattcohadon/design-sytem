import { test, expect } from '@playwright/test';

test('boucle centrale réelle : diff, validation, propagation, recharge, annulation sélective', async ({
  page,
}) => {
  await page.goto('/#/tokens');
  await expect(page.getByRole('heading', { name: 'Stride UI' })).toBeVisible();
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
  await page.getByRole('link', { name: /Changelog/ }).click();
  await page
    .getByRole('button', { name: 'Annuler la révision 1', exact: true })
    .click();
  await dialog.getByRole('button', { name: 'Valider et enregistrer' }).click();
  // On revient de la page Changelog à la page Tokens.
  await page
    .getByRole('navigation', { name: 'Navigation' })
    .getByRole('link', { name: 'Tokens', exact: true })
    .click();
  await expect(mainButton).toHaveCSS(
    'background-color',
    'oklch(0.585 0.233 277.117)',
  );
  await expect(mainButton).toHaveCSS('border-top-left-radius', '22px');
  await page.screenshot({ path: 'test-results/studio.png', fullPage: true });
});

test('V2 : Claude est le mode de travail par défaut', async ({ page }) => {
  await page.goto('/#/tokens');
  await expect(
    page.getByRole('combobox', { name: 'Mode de travail' }),
  ).toHaveValue('claude');
});

test('V2 : recherche, brouillon récupéré après recharge et abandon sans écriture', async ({
  page,
}) => {
  await page.goto('/#/tokens');
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
  await page.goto('/#/tokens');
  await page
    .getByRole('combobox', { name: 'Token', exact: true })
    .selectOption('light.primary');
  await page.getByLabel('Valeur du token').fill('#223355');
  await page.getByRole('button', { name: 'Proposer', exact: true }).click();
  const other = await context.newPage();
  await other.goto('/#/tokens');
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
  await page.goto('/#/tokens');
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
  await page.goto('/#/tokens');
  await page.getByRole('heading', { name: 'Tokens sémantiques' }).waitFor();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Aller au contenu' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Tokens', exact: true }),
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
  // Page d'accueil : tous les composants et blocs en cartes, avec pastille Figma.
  await expect(
    page.getByRole('heading', { name: 'Composants', level: 2 }),
  ).toBeVisible();
  const cards = page
    .getByRole('region', { name: 'Composants' })
    .getByRole('link');
  expect(await cards.count()).toBeGreaterThanOrEqual(60);
  await expect(
    page.getByRole('region', { name: 'Blocs' }).getByRole('link'),
  ).toHaveCount(7);
  // Barre latérale ouverte : la barre Claude reste centrée sur la fenêtre (1600 px).
  const bar = await page
    .locator('form')
    .filter({ has: page.getByLabel('Votre demande') })
    .boundingBox();
  expect(Math.abs(bar!.x + bar!.width / 2 - 800)).toBeLessThan(2);
  await page.getByLabel('Filtrer les composants').fill('dialog');
  await page
    .getByRole('navigation', { name: 'Navigation' })
    .getByRole('link', { name: 'Dialog', exact: true })
    .click();
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
  await expect(page).toHaveURL(/#\/composants\/(?!dialog$)[a-z-]+$/);
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

test('pages Bienvenue et Démarrage dans la navigation flottante', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Navigation' });
  await nav.getByRole('link', { name: 'Bienvenue', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Bienvenue', level: 2 }),
  ).toBeVisible();
  await nav.getByRole('link', { name: 'Démarrage', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Démarrage', level: 2 }),
  ).toBeVisible();
  // Sur ordinateur la navigation ne se referme pas : aucun bouton pour la masquer.
  await expect(
    page.getByRole('button', { name: 'Ouvrir la navigation' }),
  ).toBeHidden();
});

test('accessibilité : anneau de focus, Échap ferme les tokens, thème mémorisé', async ({
  page,
}) => {
  await page.goto('/#/composants/alert');
  const link = page.getByRole('link', { name: 'Tokens', exact: true }).first();
  await link.focus();
  await expect(link).toHaveCSS('box-shadow', /rgba?\(|oklch/);
  await page.getByRole('button', { name: 'Tokens', exact: true }).click();
  await expect(
    page.getByRole('complementary', { name: 'Éditeur de tokens' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('complementary', { name: 'Éditeur de tokens' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Passer au thème sombre' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('landing d’exemple : page à part, accessible par son adresse', async ({
  page,
}) => {
  await page.goto('/?preview=1&mode=light&view=landing');
  await expect(
    page.getByRole('heading', { level: 1, name: /Comprenez vos clients/ }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/Orbite/);
  await expect(
    page.getByRole('button', { name: 'Démarrer gratuitement' }).first(),
  ).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page
    .getByRole('button', { name: /carte bancaire pour essayer/ })
    .click();
  await expect(page.getByText(/aucun moyen de paiement/)).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Aller au contenu' }),
  ).toHaveCount(1);
  await expect(
    page.getByRole('link', { name: 'Voir la démo' }),
  ).toHaveAttribute('href', '#apercu');
  // Elle ne figure plus dans la navigation de la documentation.
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: /Exemple de landing/ }),
  ).toHaveCount(0);
});

test('recherche : palette Cmd/Ctrl+K et bouton de la barre du haut', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Rechercher' }).click();
  await page
    .getByPlaceholder('Rechercher une page, un composant…')
    .fill('alert dia');
  await page.getByRole('option', { name: 'Alert Dialog' }).click();
  await expect(page).toHaveURL(/#\/composants\/alert-dialog$/);
  await page.keyboard.press('Control+k');
  await expect(
    page.getByPlaceholder('Rechercher une page, un composant…'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByPlaceholder('Rechercher une page, un composant…'),
  ).toHaveCount(0);
});

test('changelog en frise et tag New sur les composants issus de Figma', async ({
  page,
}) => {
  await page.goto('/#/changelog');
  const region = page.getByRole('region', { name: 'Changelog' });
  // Selon l'ordre des tests, l'historique est vide ou contient des révisions.
  await expect(
    region
      .getByRole('heading', { name: /^Révision \d+$/ })
      .first()
      .or(region.getByText('Aucun changement enregistré')),
  ).toBeVisible();
  await page.goto('/');
  const card = page
    .getByRole('region', { name: 'Composants' })
    .getByRole('link', { name: /^Button/ })
    .first();
  await expect(card).toContainText('New');
  const tag = card.getByText('New', { exact: true });
  // Pleine arrondi : le rayon dépasse la moitié de la hauteur du tag.
  const [radius, height] = await tag.evaluate((el) => [
    parseFloat(getComputedStyle(el).borderTopLeftRadius),
    el.getBoundingClientRect().height,
  ]);
  expect(radius).toBeGreaterThanOrEqual(height / 2);
  await expect(
    page
      .getByRole('region', { name: 'Composants' })
      .getByRole('link', { name: /^Accordion/ }),
  ).not.toContainText('New');
});

test('sur cette page : la barre de progression suit le défilement puis passe à la section suivante', async ({
  page,
}) => {
  await page.goto('/');
  const toc = page.getByRole('navigation', { name: 'Sur cette page' });
  await expect(toc).toBeVisible();
  const current = toc.locator('a[aria-current="location"]');
  const progress = async () =>
    Number(
      await current.locator('[data-progress]').getAttribute('data-progress'),
    );
  // Dans la première section : la barre est derrière « Composants » et avance.
  await page.evaluate(() => scrollTo(0, 200));
  await expect(current).toContainText('Composants');
  const first = await progress();
  expect(first).toBeGreaterThan(0);
  // La barre s'anime : transition sur sa largeur et son opacité, sauf préférence de mouvement réduit.
  const transition = await current
    .locator('[data-progress]')
    .evaluate((el) => getComputedStyle(el).transitionProperty);
  expect(transition).toContain('width');
  expect(transition).toContain('opacity');
  await page.evaluate(() => scrollTo(0, 400));
  await expect.poll(progress).toBeGreaterThan(first);
  // Tout en bas : la barre est passée sur « Blocs », pleine.
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await expect(current).toContainText('Blocs');
  await expect.poll(progress).toBe(1);
  await expect(toc.locator('[data-progress]')).toHaveCount(1);
});

test('sur cette page : sur une page courte, la progression traverse chaque section sans en sauter', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 560 });
  await page.goto('/#/demarrage');
  const toc = page.getByRole('navigation', { name: 'Sur cette page' });
  await expect(toc).toBeVisible();
  const total = await toc.getByRole('link').count();
  expect(total).toBe(5);
  const visited: number[] = [];
  const max = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  expect(max).toBeGreaterThan(100);
  for (let step = 0; step <= 40; step++) {
    await page.evaluate((y) => scrollTo(0, y), (max * step) / 40);
    const index = await toc.evaluate((nav) =>
      [...nav.querySelectorAll('a')].findIndex(
        (a) => a.getAttribute('aria-current') === 'location',
      ),
    );
    if (visited.at(-1) !== index) visited.push(index);
  }
  // Chaque section est traversée dans l'ordre, y compris la dernière, sans saut de 1 à 5.
  const real = visited.filter((i) => i >= 0);
  expect(real).toEqual([0, 1, 2, 3, 4]);
});

test('sur cette page : pas de transition avec la préférence de mouvement réduit', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  // La page doit être rendue avant de défiler, sinon le défilement est ramené à 0.
  await expect(
    page.getByRole('navigation', { name: 'Sur cette page' }),
  ).toBeVisible();
  await page.evaluate(() => scrollTo(0, 200));
  const bar = page.locator(
    'nav[aria-label="Sur cette page"] a[aria-current="location"] [data-progress]',
  );
  await expect(bar).toHaveCount(1);
  expect(
    await bar.evaluate((el) => getComputedStyle(el).transitionProperty),
  ).toBe('none');
});
