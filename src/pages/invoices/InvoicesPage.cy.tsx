import { InvoicesPage } from "./InvoicesPage"

describe(`InvoicesPage`, () => {
  describe(`Initialization`, initializationTests)
})

function initializationTests() {
  it(`
  GIVEN invoices page component
  WHEN render the component
  SHOULD see them
  `, () => {
    mountComponent()

    cy.contains(`Invoices`)
  })
}

function mountComponent() {
  cy
    .mount(
      <InvoicesPage />,
    )
}
