import { InvoicesPage } from "./pages/InvoicesPage"

describe(`Go To Invoices Page Happy Path`, () => {
  it(`
  GIVEN invoices page
  WHEN visit /invoices
  SHOULD see "Invoices"
  `, () => {
    InvoicesPage.visit()

    cy
      .contains(`Invoices`)
      .should(`be.visible`)
  })
})
