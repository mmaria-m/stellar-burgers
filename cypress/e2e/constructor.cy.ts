// Селекторы
const SELECTOR_INGREDIENT_BUN = '[data-testid="ingredient-bun"]';
const SELECTOR_INGREDIENT_MAIN = '[data-testid="ingredient-main"]';
const SELECTOR_INGREDIENT_SAUCE = '[data-testid="ingredient-sauce"]';
const SELECTOR_CONSTRUCTOR_BUN_TOP = '[data-testid="constructor-bun-top"]';
const SELECTOR_CONSTRUCTOR_BUN_BOTTOM = '[data-testid="constructor-bun-bottom"]';
const SELECTOR_CONSTRUCTOR_INGREDIENTS = '[data-testid="constructor-ingredients"]';
const SELECTOR_MODAL = '[data-testid="modal"]';
const SELECTOR_MODAL_CLOSE = '[data-testid="modal-close"]';
const SELECTOR_MODAL_OVERLAY = '[data-testid="modal-overlay"]';
const SELECTOR_ORDER_BUTTON = '[data-testid="order-button"]';
const SELECTOR_ORDER_MODAL = '[data-testid="order-modal"]';
const SELECTOR_ORDER_NUMBER = '[data-testid="order-number"]';

describe('Stellar Burgers', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должно добавлять булку в конструктор', () => {
      cy.get(SELECTOR_INGREDIENT_BUN)
        .contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.get(SELECTOR_CONSTRUCTOR_BUN_TOP).should('contain.text', 'Краторная булка N-200i');
      cy.get(SELECTOR_CONSTRUCTOR_BUN_BOTTOM).should('contain.text', 'Краторная булка N-200i');
    });

    it('должно добавлять начинку в конструктор', () => {
      cy.get(SELECTOR_INGREDIENT_MAIN)
        .contains('Говяжий метеорит (отбивная)')
        .parent()
        .find('button')
        .click();

      cy.get(SELECTOR_CONSTRUCTOR_INGREDIENTS).should('contain.text', 'Говяжий метеорит (отбивная)');
    });

    it('должно добавлять соус в конструктор', () => {
      cy.get(SELECTOR_INGREDIENT_SAUCE)
        .contains('Соус фирменный Space Sauce')
        .parent()
        .find('button')
        .click();

      cy.get(SELECTOR_CONSTRUCTOR_INGREDIENTS).should('contain.text', 'Соус фирменный Space Sauce');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открывать модальное окно при клике на ингредиент и показывать его данные', () => {
      cy.get(SELECTOR_INGREDIENT_MAIN)
        .contains('Говяжий метеорит (отбивная)')
        .click();

      cy.get(SELECTOR_MODAL).should('be.visible');
      cy.get(SELECTOR_MODAL).should('contain.text', 'Говяжий метеорит (отбивная)');
    });

    it('должно закрывать модальное окно при клике на крестик', () => {
      cy.get(SELECTOR_INGREDIENT_MAIN)
        .contains('Говяжий метеорит (отбивная)')
        .click();
      cy.get(SELECTOR_MODAL).should('be.visible');

      cy.get(SELECTOR_MODAL_CLOSE).click();

      cy.get(SELECTOR_MODAL).should('not.exist');
    });

    it('должно закрывать модальное окно при клике на оверлей', () => {
      cy.get(SELECTOR_INGREDIENT_MAIN)
        .contains('Говяжий метеорит (отбивная)')
        .click();
      cy.get(SELECTOR_MODAL).should('be.visible');

      cy.get(SELECTOR_MODAL_OVERLAY).click({ force: true });

      cy.get(SELECTOR_MODAL).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должно создавать заказ и очищать конструктор после закрытия модального окна', () => {

      cy.get(SELECTOR_INGREDIENT_BUN)
        .contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.get(SELECTOR_INGREDIENT_MAIN)
        .contains('Говяжий метеорит (отбивная)')
        .parent()
        .find('button')
        .click();

      cy.get(SELECTOR_ORDER_BUTTON).click();

      cy.wait('@createOrder');

      cy.get(SELECTOR_ORDER_MODAL).should('be.visible');
      cy.get(SELECTOR_ORDER_NUMBER).should('contain.text', '12345');

      cy.get(SELECTOR_MODAL_CLOSE).click();
      cy.get(SELECTOR_ORDER_MODAL).should('not.exist');

      cy.get(SELECTOR_CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(SELECTOR_CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
      cy.get(SELECTOR_CONSTRUCTOR_INGREDIENTS).should('contain.text', 'Выберите начинку');
    });
  });
});