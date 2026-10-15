import { InvoicesContainer } from "./InvoicesContainer"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoiceData } from "./types"

describe(`InvoicesContent`, () => {
  describe(`Can Copy`, canCopyTests)
  describe(`Copy Functionality`, copyToClipboardTests)
  describe(`Copy Button Text`, copyButtonTextTests)
  describe(`Merge Employee's Hours `, mergeEmployeesHoursTests)
})

function canCopyTests() {
  it(`
  GIVEN invoices table 
  WHEN total amount is not calculated
  SHOULD disable "Copy as Text" button
  `, () => {
    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          fullName: `John Doe`,
          position: `Developer`,
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
          fullName: `John Doe`,
          position: `Developer`,
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
          fullName: `John Doe`,
          position: `Developer`,
          trackedHours: 160,
          rate: 50,
          total: 8000,
        },
        {
          employeeId: 2,
          fullName: `Jane Doe`,
          position: `Designer`,
          trackedHours: 80,
          rate: 45,
          total: 3600,
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

function copyButtonTextTests() {
  it(`
  GIVEN all rates are filled
  WHEN click "Copy as Text" button
  SHOULD change button text to "Copied"
  `, () => {
    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          fullName: `John Doe`,
          position: `Developer`,
          trackedHours: 160,
          rate: 50,
          total: 8000,
        },
      ],
    })

    cy
      .getByData(`invoices-copy-button`)
      .contains(`Copy as Text`)

    cy
      .getByData(`invoices-copy-button`)
      .click()

    cy
      .getByData(`invoices-copy-button`)
      .contains(`Copied`)

    // need to check functionality of setTimeout for the button
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)

    cy
      .getByData(`invoices-copy-button`)
      .contains(`Copy as Text`)
  })
}

function mergeEmployeesHoursTest() {
function mergeEmployeesHoursTests() {
  it(`
  GIVEN invoice table with employees tracked hours
  WHEN manager merges one employee's hours into another employee
  THEN the hours should be summed up
  AND the merged employee should be removed from the table
  AND the invoice text should not contain the merged employee
  `, () => {
    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          fullName: `John Doe`,
          trackedHours: 20,
        },
        {
          employeeId: 2,
          fullName: `Jane Doe`,
          position: `Developer`,
          trackedHours: 140,
          rate: 20,
        },
        {
          employeeId: 3,
          fullName: `Ivan Ivanov`,
          position: `Developer`,
          trackedHours: 40,
        },
      ],
    })

    cy
      .getByData(`invoices-merge-select`)
      .eq(1)
      .click()

    cy
      .contains(`John D.`)
      .click()

    cy
      .getByData(`table-row`)
      .should(`have.length`, 2)

    cy
      .getByData(`invoices-tracked-hours`)
      .eq(0)
      .should(`have.text`, 160)

    cy
      .getByData(`invoices-merge-select`)
      .eq(0)
      .click()

    cy
      .contains(`Ivan I.`)
      .click()

    cy
      .getByData(`table-row`)
      .should(`have.length`, 1)

    cy
      .getByData(`invoices-tracked-hours`)
      .eq(0)
      .should(`have.text`, 200)   

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
        `Developer: €20 * 200h = €4 000\nTotal: €4 000`,
      )
  },
  )    
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