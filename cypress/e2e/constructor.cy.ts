describe('Интеграционные тесты для конструктора бургера', () => {
  const bunElementTop = '[data-cy=bun-element-top]';
  const ingredientsList = '[data-cy=ingredients-list]';
  const modal = '[data-cy="modal"]';
  const orderButton = '[data-cy=order-button]';
  const modalClose = '[data-cy="ModalClose"]';
  const ingredients = {
    bun: 'Краторная булка N-200i',
    filling: 'Начинка',
    sauce: 'Соус'
  };

  beforeEach(() => {
    cy.setCookie('accessToken', 'someAccessToken');
    localStorage.setItem('refreshToken', 'someRefreshToken');
    cy.intercept('GET', `api/ingredients`, { fixture: 'ingredients.json' });
    cy.intercept('POST', `api/orders`, { fixture: 'order.json' });
    cy.intercept('GET', `api/auth/user`, { fixture: 'user.json' });

    cy.visit('');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Добавление ингредиента из списка ингредиентов в конструктор.', () => {
    // Проверяем, что булка отсутствует в конструкторе
    cy.get(bunElementTop).should('not.exist');

    // Добавляем булку
    cy.get('h3').contains('Булки').next('ul').contains('Добавить').click();
    cy.get(bunElementTop).should('exist');

    // Проверяем, что начинка отсутствует в конструкторе
    cy.get(ingredientsList).contains('Начинка').should('not.exist');

    // Добавляем начинку
    cy.get('h3').contains('Начинки').next('ul').contains('Добавить').click();
    cy.get(ingredientsList).should('exist');

    cy.get(ingredientsList).contains('Соус').should('not.exist');

    // Добавляем соус
    cy.get('h3').contains('Соусы').next('ul').contains('Добавить').click();
    cy.get(ingredientsList).should('exist');
  });

  it('Открытие и закрытие модального окна с информацией об ингредиенте', () => {
    // Клик по ингредиенту
    cy.get('p').contains(ingredients.bun).click();
    cy.get(modal).should('be.visible');
    cy.get(modal).should('contain', 'Детали ингредиента');
    cy.get(modal).should('contain', ingredients.bun);

    // Закрываем модалку
    cy.get(modalClose).click();
    cy.get(modal).should('not.exist');
  });

  it('Создание заказа с выбранными ингредиентами', () => {
    cy.get('h3').contains('Булки').next('ul').contains('Добавить').click();
    cy.get('h3').contains('Начинки').next('ul').contains('Добавить').click();
    cy.get('h3').contains('Соусы').next('ul').contains('Добавить').click();

    cy.get(orderButton).click();
    cy.get(modal).should('be.visible');
    cy.get('[data-cy="orderNumber"]').should('contain', '56736');

    cy.get(modalClose).click();

    cy.get(bunElementTop).should('not.exist');
    cy.get(ingredientsList).contains('Начинка').should('not.exist');
  });
});
