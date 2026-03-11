import { InvoicesContainer } from "./InvoicesContainer"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"

describe(`InvoicesContainer`, () => {
  describe(`Initialization`, initializationTests)
})

function initializationTests() {
  it(`
  GIVEN invoices data from network
  WHEN render the component
  SHOULD see it
  `, () => {
    cy.viewport(1024, 600)

    mountComponent()
    
    cy.contains(`John Doe`)
  })
}

function mountComponent() {
  const invoicesState = new InvoicesState()

  cy.mount(
    <InvoicesStateContext.Provider value={invoicesState}>
      <InvoicesContainer/>
    </InvoicesStateContext.Provider>,
  )
}
