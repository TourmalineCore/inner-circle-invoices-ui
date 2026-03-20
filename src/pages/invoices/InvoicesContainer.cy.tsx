import { InvoicesContainer } from "./InvoicesContainer"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"

const PROJECTS = {
  projects: [
    {
      id: 1,
      name: `ProjectOne`,
    },
    {
      id: 2,
      name: `ProjectTwo`,
    },
  ],
}

const INVOICE_DATA = {
  employeesEntries: [
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
}
describe(`InvoicesContainer`, () => {
  beforeEach(() => {
    cy.viewport(1024, 600)

    cy.intercept(
      `GET`,
      `*/invoices/projects`,
      {
        statusCode: 200,
        body: PROJECTS,
      },
    )
      .as(`getProjects`)

    mountComponent()
    
    cy.wait(`@getProjects`)
  })

  describe(`Initialization`, initializationTests)
  describe(`Button Enable`, buttonEnableTests)
  describe(`Copy Functionality`, copyToClipboardTests)
  describe(`Projects`, projectsTests)
})

function initializationTests() {
  it(`
  GIVEN projects dropdown
  WHEN select project
  SHOULD see loaded data for this project in the table
  `, () => {
    cy.intercept(
      `GET`,
      `*/invoices/?projectId=1&month=3&year=2026`,
      {
        statusCode: 200,
        body: INVOICE_DATA, 
      },
    ) 
      .as(`getInvoices`)

    cy.getByData(`project-select`)
      .select(`1`)

    cy.wait(`@getInvoices`)

    cy.contains(`John Doe`)

    cy
      .contains(`160`)
      .should(`be.visible`)
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
    cy.intercept(
      `GET`,
      `*/invoices/?projectId=1&month=3&year=2026`,
      {
        statusCode: 200,
        body: INVOICE_DATA,
      },
    )
      .as(`getInvoices`)
    
    cy.getByData(`project-select`)
      .select(`1`)
    
    cy.wait(`@getInvoices`)
    
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
    cy.intercept(
      `GET`,
      `*/invoices/?projectId=1&month=3&year=2026`,
      {
        statusCode: 200,
        body: INVOICE_DATA, 
      },
    ) 
      .as(`getInvoices`)

    cy
      .getByData(`project-select`)
      .select(`1`)
    
    cy.wait(`@getInvoices`)
    
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
        `Developer: €50 * 160h = €8 000\nDesigner: €45 * 80h = €3 600\nTotal: €11 600`,
      )
  })
}

function projectsTests() {
  it(`
  GIVEN invoices table
  WHEN component mounts
  SHOULD show loaded projects in the dropdown
  `, () => {    
    cy
      .getByData(`projects-select-option`)
      .should(`have.length`, 2)

    cy
      .getByData(`projects-select-option`)
      .eq(0)
      .should(`have.value`, `1`)
      .and(`have.text`, `ProjectOne`)

    cy
      .getByData(`projects-select-option`)
      .eq(1)
      .should(`have.value`, `2`)
      .and(`have.text`, `ProjectTwo`)
  })

  it(`
  GIVEN projects dropdown
  WHEN user selects a project
  SHOULD update selected project and send request with this project id
  `, () => {
    cy
      .getByData(`project-select`)
      .select(`1`)

    cy
      .get(`@setSelectedProjectIdSpy`)
      .should(`have.been.calledOnce`)
      .and(`have.been.calledWith`, {
        projectId: 1, 
      })
  })
}

function mountComponent() {
  const invoicesState = new InvoicesState()
  
  cy.spy(invoicesState, `setSelectedProjectId`)
    .as(`setSelectedProjectIdSpy`)

  cy.mount(
    <InvoicesStateContext.Provider value={invoicesState}>
      <InvoicesContainer/>
    </InvoicesStateContext.Provider>,
  )
}