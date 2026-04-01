import { InvoicesPage } from "./pages/InvoicesPage"

describe(`Go To Invoices Page Happy Path`, () => {
  beforeEach(`Authorize`, () => {
    cy.authByApi()
  })
  
  it(`
  GIVEN invoices page
  WHEN visit /invoices
  SHOULD see "Invoices"
  `, () => {
    InvoicesPage.visit()

    cy
      .getByData(`invoices`)
      .should(`be.visible`)
  })
})
