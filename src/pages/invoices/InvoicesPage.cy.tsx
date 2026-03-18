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
    
    cy.intercept(`GET`, `api/invoices`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: `John Doe`,
          trackedHours: 160,
        },
        {
          id: 2,
          name: `Jane Doe`,
          trackedHours: 80,
        },
      ],
    })
    
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
