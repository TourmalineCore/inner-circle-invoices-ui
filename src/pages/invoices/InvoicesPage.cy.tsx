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
    cy.viewport(1024, 600)
    
    mountComponent()

    cy.contains(`John Doe`)
  })
}

function mountComponent() {
  cy
    .mount(
      <InvoicesPage />,
    )
}
