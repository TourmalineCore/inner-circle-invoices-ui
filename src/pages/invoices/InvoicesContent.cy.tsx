import { InvoicesContainer } from "./InvoicesContainer"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoiceData } from "./types"

describe(`InvoicesContent`, () => {
  describe(`Can Copy`, canCopyTests)
  describe(`Copy Functionality`, copyToClipboardTests)
})

function canCopyTests() {
  it(`
  GIVEN invoices table 
  WHEN total amount is not calculated
  SHOULD disable Copy as Text button
  `, () => {
    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          name: `John Doe`,
          position: `developer`,
          trackedHours: 40,
        },
      ],
    })

    cy
      .getByData(`invoices-copy-button`)
      .should(`be.disabled`)
  })

  it(`
  GIVEN invoices table 
  WHEN total amount is calculated
  SHOULD enable Copy as Text button
  `, () => {
    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          name: `John Doe`,
          position: `developer`,
          trackedHours: 40,
          rate: 50,
        },
      ],
    })

    cy
      .getByData(`invoices-copy-button`)
      .should(`be.enabled`)
  })
}

function copyToClipboardTests() {
  it(`
  GIVEN all rates are filled
  WHEN "Copy as Text" button is clicked
  SHOULD copy correct invoice text to clipboard
  `, () => {
    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          name: `John Doe`,
          position: `Developer`,
          trackedHours: 160,
          rate: 50,
        },
        {
          employeeId: 2,
          name: `Jane Doe`,
          position: `Designer`,
          trackedHours: 80,
          rate: 45,
        },
      ],
    })
 
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
        `Developer: €50 * 160h = €8 000\nDesigner: €45 * 80h = €3 600\nTotal: €11 600`,
      )
  })
}

function mountComponent({
  invoicesDataForInitialize,
}: {
  invoicesDataForInitialize: InvoiceData[],
}) {
  const invoicesState = new InvoicesState()

  invoicesState.initializeInvoicesData({
    invoicesData: invoicesDataForInitialize,
  })

  cy.viewport(1024, 600)

  cy.mount(
    <InvoicesStateContext.Provider value={invoicesState}>
      <InvoicesContainer/>
    </InvoicesStateContext.Provider>,
  )
}