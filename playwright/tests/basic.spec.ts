import { test, expect } from '@playwright/test';
import { clickOnRecipe, logIn, logOut } from '../src/MainPlaywright';

test.describe("Tests de base du site", () => {
  test('Accès au site', async ({ page }) => {
    // Naviguer vers le site
    await page.goto('https://lambda.cours.quimerch.com/');
    await expect(page.getByText('Made with ❤️‍🔥 by Antoine')).toBeVisible();
  });
  test('Connexion & déconnection au site', async ({ page }) => {
    // Naviguer vers le site
    await page.goto('https://lambda.cours.quimerch.com/');
    // Se connecter
    await logIn(page);
    // Vérifier que le nom d'utilisateur est visible
    await expect(page.getByRole('link', { name: 'lambda' })).toBeVisible();
    // Vérifier que le bouton de déconnexion est visible
    await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeVisible();

    // Se déconnecter
    await logOut(page);
    // Vérifier que le bouton de connexion est visible
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeVisible();
  });
  test('Accès à la page d\'une recette', async ({ page }) => {
    // Cliquer sur une recette et vérifier la présence du compteur de liens
    await page.goto('https://lambda.cours.quimerch.com/');
    await clickOnRecipe(page);
    const likeCounter = await page.locator('div.flex.items-center.gap-1 > span.text-lg.text-white').first();
    await likeCounter.waitFor({ state: 'visible' });
    const counterText = await likeCounter.textContent();
    expect(counterText).toMatch(/^\d+$/);
  });

});