import { InvoicesContainer } from "./InvoicesContainer"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoiceData } from "./types"

describe(`InvoicesContent`, () => {
  describe(`Can Copy`, canCopyTests)
  describe(`Copy Functionality`, copyToClipboardTests)
  describe(`Copy Button Text`, copyButtonTextTests)
  describe(`Merge Employee's Hours `, mergeEmployeesHoursTests)
  describe(`Fill Project Name Input`, fillProjectNameInputTests)
  describe(`Fill Purchase Order Number Input`, fillPurchaseOrderNumberInputTests)
})

function canCopyTests() {
  it(`
  GIVEN invoices table
  WHEN required fields are not filled
  SHOULD disable "Copy as Text" button
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
      .should(`be.disabled`)
  })
  
  it(`
  GIVEN invoices table
  WHEN total amount is calculated and required fields are filled
  SHOULD enable "Copy as Text" button
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
      projectName: `ProjectOne`,
      purchaseOrderNumber: `123`,
    })

    cy
      .getByData(`invoices-copy-button`)
      .should(`be.enabled`)
  })
}

function copyToClipboardTests() {
  it(`
  GIVEN all required fields are filled
  WHEN "Copy as Text" button is clicked
  SHOULD copy correct invoice text to clipboard
  `, () => {
    cy.clock(new Date(2026, 9, 21), [
      `Date`,
    ])
    
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
      projectName: `ProjectOne`,
      purchaseOrderNumber: `123`,
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
        `PO 123; Period: October 2026; Project: ProjectOne;\nDeveloper: €50 * 160h = €8 000\nDesigner: €45 * 80h = €3 600\nTotal: €11 600`,
      )
  })

  it(`
  GIVEN purchase order number, project name and position contain leading/trailing spaces
  WHEN "Copy as Text" button is clicked
  SHOULD trim them in the copied text
  `, () => {
    cy.clock(new Date(2026, 9, 21), [
      `Date`,
    ])

    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          fullName: `John Doe`,
          position: `   Developer   `,
          trackedHours: 160,
          rate: 50,
          total: 8000,
        },
      ],
      projectName: `   ProjectOne   `,
      purchaseOrderNumber: `   123   `,
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
        `PO 123; Period: October 2026; Project: ProjectOne;\nDeveloper: €50 * 160h = €8 000\nTotal: €8 000`,
      )
  })
}

function copyButtonTextTests() {
  it(`
  GIVEN all required fields are filled
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
      projectName: `ProjectOne`,
      purchaseOrderNumber: `123`,
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

function mergeEmployeesHoursTests() {
  it(`
  GIVEN invoice table with employees tracked hours
  WHEN manager merges one employee's hours into another employee
  SHOULD the hours be summed up
  AND the total amount should be calculated as summed hours multiplied by the rate of the target employee
  AND the merged employee should be removed from the table
  AND the invoice text should not contain the merged employee
  `, () => {
    cy.clock(new Date(2026, 9, 21), [
      `Date`,
    ])
    
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
      projectName: `ProjectOne`,
      purchaseOrderNumber: `123`,
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
        `PO 123; Period: October 2026; Project: ProjectOne;\nDeveloper: €20 * 200h = €4 000\nTotal: €4 000`,
      )
  },
  )    
}

function fillProjectNameInputTests() {
  it(`
  GIVEN invoices table
  WHEN a project name is typed
  SHOULD invoices state projectName be updated with the typed value
  `, () => {
    const projectName = `Inner Circle`
    
    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          fullName: `John Doe`,
          trackedHours: 20,
        },
      ],
    })

    cy
      .getByData(`invoices-project-name-input`)
      .type(projectName)

    cy
      .getByData(`invoices-project-name-input`)
      .should(`have.value`, projectName)

    cy
      .get<InvoicesState>(`@invoicesState`)
      .should((invoicesState) => {
        expect(invoicesState.projectName).to.eq(projectName)
      })
  })
}

function fillPurchaseOrderNumberInputTests() {
  it(`
  GIVEN invoices table
  WHEN a purchase order number is typed
  SHOULD invoices state purchaseOrderNumber be updated with the typed value
  `, () => {
    const purchaseOrderNumber = `123`

    mountComponent({
      invoicesDataForInitialize: [
        {
          employeeId: 1,
          fullName: `John Doe`,
          trackedHours: 20,
        },
      ],
    })

    cy
      .getByData(`invoices-purchase-order-number-input`)
      .type(purchaseOrderNumber)

    cy
      .getByData(`invoices-purchase-order-number-input`)
      .should(`have.value`, purchaseOrderNumber)

    cy
      .get<InvoicesState>(`@invoicesState`)
      .should((invoicesState) => {
        expect(invoicesState.purchaseOrderNumber).to.eq(purchaseOrderNumber)
      })
  })
}

function mountComponent({
  invoicesDataForInitialize,
  projectName = ``,
  purchaseOrderNumber = ``,
}: {
  invoicesDataForInitialize: InvoiceData[],
  projectName?: string,
  purchaseOrderNumber?: string,
}) {
  const invoicesState = new InvoicesState()

  invoicesState.initializeInvoicesData({
    invoicesData: invoicesDataForInitialize,
  })

  invoicesState.setProjectName({
    projectName, 
  })

  invoicesState.setPurchaseOrderNumber({
    purchaseOrderNumber, 
  })

  cy
    .wrap(invoicesState)
    .as(`invoicesState`)

  cy.viewport(1024, 600)

  cy.mount(
    <InvoicesStateContext.Provider value={invoicesState}>
      <InvoicesContainer/>
    </InvoicesStateContext.Provider>,
  )
}