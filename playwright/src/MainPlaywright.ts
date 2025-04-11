import { Page } from 'playwright';

export async function clickOnRecipe(page: Page) {
    await page.getByRole('button', { name: 'Explorer nos recettes' }).click();
    const recipe = await page.locator("#all-recipes div").first();
    await recipe.scrollIntoViewIfNeeded();
    await page.locator(".bg-white > .p-6 > a").first().click();
}

export async function logIn(page: Page) {
    await page.getByRole('button', { name: 'Connexion' }).click();
    await page.getByRole('textbox', { name: 'Nom d\'utilisateur' }).fill('lambda');
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill('n8B5TPSumf89C9gnyJMFJektjR');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await new Promise(r => setTimeout(r, 1000));
}

export async function logOut(page: Page) {
    await page.getByRole('button', { name: 'Déconnexion' }).click();
    await new Promise(r => setTimeout(r, 1000));
}