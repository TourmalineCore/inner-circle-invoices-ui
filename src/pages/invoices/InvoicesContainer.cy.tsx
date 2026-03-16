import { InvoicesContainer } from "./InvoicesContainer"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"

describe(`InvoicesContainer`, () => {
  describe(`Initialization`, initializationTests)
  describe(`Button Enable`, buttonEnableTests)
  describe(`Copy Functionality`, copyToClipboardTests)
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

function buttonEnableTests() {
  it(`
  GIVEN invoices table 
  WHEN total amount is calculated
  SHOULD enable Copy as Text button
  AND when total amount is not calculated because rate filled was emptied
  SHOULD disable Copy as Text button
  `, () => {
    cy.viewport(1024, 600)
    
    mountComponent()
    
    cy
      .getByData(`invoices-copy-button`)
      .should(`be.disabled`)

    cy
      .getByData(`invoices-rate-input-1`)
      .type(`50`)
      .blur()

    cy
      .getByData(`invoices-copy-button`)
      .should(`be.disabled`)

    cy
      .getByData(`invoices-rate-input-2`)
      .type(`45`)

    cy
      .getByData(`invoices-rate-input-2`)
      .blur()

    cy
      .getByData(`invoices-copy-button`)
      .should(`be.enabled`)

    cy
      .getByData(`invoices-rate-input-1`)
      .clear()
      .blur()

    cy
      .getByData(`invoices-copy-button`)
      .should(`be.disabled`)
  })
}

function copyToClipboardTests() {
  it(`
  GIVEN all rates are filled
  WHEN Copy as Text button is clicked
  SHOULD copy correct invoice text to clipboard
  `, () => {
    cy.viewport(1024, 600)

    mountComponent()
    
    cy
      .getByData(`invoices-rate-input-1`)
      .type(`50`)
      .blur()

    cy
      .getByData(`invoices-position-input-1`)
      .type(`Developer`)
    
    cy
      .getByData(`invoices-position-input-1`)
      .blur()
      
    cy
      .getByData(`invoices-rate-input-2`)
      .type(`45`)

    cy
      .getByData(`invoices-rate-input-2`)
      .blur()
    
    cy
      .getByData(`invoices-position-input-2`)
      .type(`Designer`)
    
    cy
      .getByData(`invoices-position-input-2`)
      .blur()

    cy
      .window()
      .then((window) => {
        cy.stub(window.navigator.clipboard, `writeText`)
          .as(`copyToClipboard`)  
          .resolves()
      })

    cy
      .getByData(`invoices-copy-button`)
      .click()

    cy
      .get(`@copyToClipboard`)
      .should(
        `have.been.calledOnceWith`,
        `Developer: 50€ * 160h = 8000€\nDesigner: 45€ * 80h = 3600€\nTotal: 11600€`,
      )
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
