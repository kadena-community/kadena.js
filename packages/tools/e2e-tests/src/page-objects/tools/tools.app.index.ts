import type { Page } from '@playwright/test';
import StartPage from './pages/start.page';

export default class ToolsAppIndex {
    private readonly page: Page;
    public readonly startPage: StartPage;

    constructor(page: Page) {
        this.page = page;
        this.startPage = new StartPage(this.page);
    }
}
