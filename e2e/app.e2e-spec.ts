import { NyPage } from './app.po';

describe('ny App', () => {
  let page: NyPage;

  beforeEach(() => {
    page = new NyPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
