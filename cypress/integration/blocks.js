context('Blocks Acceptance Tests', () => {
  describe('Text Block Tests', () => {
    beforeEach(() => {
      // given a logged in editor and a page in edit mode
      cy.visit('/');
      cy.autologin();
      cy.createContent({
        contentType: 'Document',
        contentId: 'document',
        contentTitle: 'Test document',
      });
      cy.createContent({
        contentType: 'Document',
        contentId: 'my-page',
        contentTitle: 'My Page',
        path: '/document',
      });
      // Adding Image for Grid Image
      cy.createContent({
        contentType: 'Image',
        contentId: 'my-image',
        contentTitle: 'My Image',
        path: '/document',
      });
      cy.visit('/document');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      cy.waitForResourceToLoad('document');
      cy.navigate('/document/edit');
      cy.get(`.block.title [data-contents]`);
    });

    it('As editor I can add a Grid', function () {
      cy.get('.block.inner.text .public-DraftEditor-content').click();
      cy.get('.button .block-add-button').click({ force: true });
      cy.get('.blocks-chooser .mostUsed .button.__grid').click();
      cy.findByText('2 columns').click();

      cy.get('button[aria-label="Add grid block in position 0"]').click();
      cy.get('.blocks-chooser .mostUsed .button.image').click();
      cy.get('.block.image .toolbar-inner .buttons:first-child').click();
      cy.get('[aria-label="Select my-image"]').dblclick();
      cy.findByText('my-image');

      cy.get('button[aria-label="Add grid block in position 1"]').click();
      cy.get('.blocks-chooser [aria-label="Unfold Text blocks"]').click();
      cy.get('.blocks-chooser .text .button.text').click();
      cy.get('.block.inner.__grid .public-DraftEditor-content').type(
        'Colorless green ideas sleep furiously.',
      );

      cy.get('#toolbar-save').click();

      cy.findByText('Colorless green ideas sleep furiously.');

      cy.navigate('/document/edit');
      cy.wait(500);
      cy.get('.block.inner.__grid').click();
      cy.get(
        '.block.inner.__grid [aria-label="Remove grid element 1"]',
      ).click();
      cy.get(
        '.block.inner.__grid .toolbar [aria-label="Add grid element"]',
      ).click();
      cy.get('button[aria-label="Add grid block in position 1"]').click();
      cy.get('.blocks-chooser .mostUsed .button.teaser').click();
      cy.get(
        '.objectbrowser-field[aria-labelledby="fieldset-default-field-label-href"] button[aria-label="Open object browser"]',
      ).click();
      cy.get('[aria-label="Select my-page"]').dblclick();
      cy.get('#toolbar-save').click();

      cy.get('.block.__grid').findByText('My Page');
    });

    it('As editor I can add a Teaser Grid', function () {
      // creating Teaser Grid block in edit mode
      cy.get('.block.inner.text .public-DraftEditor-content').click();
      cy.get('.button .block-add-button').click({ force: true });
      cy.get('.blocks-chooser .mostUsed .button.teaserGrid').click();
      cy.findByText('2 columns').click();
      cy.get(
        '.teaserGrid.two [data-rbd-draggable-context-id]:first-child',
      ).click();
      cy.get(
        '#sidebar-properties .inline.field.text:first-of-type() .objectbrowser-field:first-of-type() .ui.button.action svg',
      ).click();
      cy.findByLabelText('Select my-page').dblclick();
      // This is because the objectbrowser doesn't shows the content
      cy.wait(500);
      cy.get(
        '#sidebar-properties .inline.field.text:nth-of-type(4) .objectbrowser-field:first-of-type() .ui.button.action svg',
      ).click();
      cy.findByText('My Image', { selector: 'span' }).click();
      cy.get(
        '.teaserGrid.two [data-rbd-draggable-context-id]:nth-child(2)',
      ).click();
      cy.get(
        '#sidebar-properties .inline.field.text:first-of-type() .objectbrowser-field:first-of-type() .ui.button.action svg',
      ).click();
      cy.findByLabelText('Select my-page').dblclick();

      // This is because the objectbrowser doesn't shows the content
      cy.wait(500);
      cy.get(
        '#sidebar-properties .inline.field.text:nth-of-type(4) .objectbrowser-field:first-of-type() .ui.button.action svg',
      ).click();
      cy.findByLabelText('Select my-image').dblclick();

      cy.get('#toolbar-save').click();
      cy.wait(500);

      //then we are able to get the My Page in view Mode.
      cy.get('.block.teaserGrid .two.column .column:first-child h3').should(
        'have.text',
        'My Page',
      );
    });

    it('As editor I can add an Image Grid', function () {
      // creating Image Grid in edit mode
      cy.get('.block.inner.text .public-DraftEditor-content').click();
      cy.get('.button .block-add-button').click({ force: true });
      cy.get('.blocks-chooser .mostUsed .button.imagesGrid').click();
      cy.findByText('2 columns').click();
      cy.get(
        '.imagesGrid.two [data-rbd-draggable-context-id]:first-child .toolbar-inner .buttons:first-child button',
      ).click();
      cy.findByLabelText('Select my-image').dblclick();

      cy.get(
        '.imagesGrid.two [data-rbd-draggable-context-id]:last-child .toolbar-inner .buttons:first-child button',
      ).click();
      cy.findByLabelText('Select my-image').dblclick();

      cy.get('#toolbar-save').click();

      //then we should have AltText My Image present in view mode
      cy.findAllByAltText('My Image').should('have.length', 2);
    });

    // Basic, Volto ones
    it('As editor I can add a text block', () => {
      // when I add a text block
      cy.get('.block.inner.text .public-DraftEditor-content')
        .click()
        .type('My text')
        .get('span[data-text]')
        .contains('My text');
      cy.get('#toolbar-save').click();
      cy.url().should('eq', Cypress.config().baseUrl + 'document');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      cy.waitForResourceToLoad('document');

      // then the page view should contain the text block
      cy.get('#page-document p').contains('My text');
    });

    it('As editor I can add a link to a text block', function () {
      cy.get('.documentFirstHeading > .public-DraftStyleDefault-block');

      // when I create a link
      cy.get('.block.inner.text .public-DraftEditor-content')
        .type('Colorless green ideas sleep furiously.')
        .setSelection('furiously');
      cy.get(
        '#page-edit .draftJsToolbar__buttonWrapper__1Dmqh:nth-of-type(3)',
      ).click();
      cy.get('.link-form-container input').type('https://google.com{enter}');
      cy.get('#toolbar-save').click();
      cy.url().should('eq', Cypress.config().baseUrl + 'document');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      cy.waitForResourceToLoad('document');

      // then the page view should contain a link
      cy.get('.ui.container p').contains(
        'Colorless green ideas sleep furiously.',
      );
      cy.get('.ui.container p a')
        .should('have.attr', 'href')
        .and('include', 'https://google.com');
    });
  });
});
