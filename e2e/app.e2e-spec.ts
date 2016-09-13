import { Finpro2Page } from './app.po';

describe('finpro2 App', function() {
  let page: Finpro2Page;

  beforeEach(() => {
    page = new Finpro2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
