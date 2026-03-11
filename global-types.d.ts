// https://docs.cypress.io/guides/component-testing/faq#How-do-I-get-TypeScript-to-recognize-Cypress-types-and-not-Jest-types
// to resolve describe, it lint error in cy.tsx files
/// <reference types="cypress" />
/// <reference types="./**/types/**/*.d.ts" />
