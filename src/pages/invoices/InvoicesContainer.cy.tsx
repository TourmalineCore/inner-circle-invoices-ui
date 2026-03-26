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
  employeesTrackedTaskHours: [
    {
      employeeId: 1,
      name: `John Doe`,
      trackedHours: 160,
    },
    {
      employeeId: 2,
      name: `Jane Doe`,
      trackedHours: 80,
    },
  ],
}

describe(`InvoicesContainer`, () => {
  beforeEach(() => {
    cy.viewport(1024, 600)

    // set cypress default date
    cy.clock(new Date(2026, 3, 26), [
      `Date`,
    ])

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
  describe(`Projects`, projectsTests)
  describe(`Month Change`, monthChangeTests)
})

function initializationTests() {
  it(`
  GIVEN projects dropdown
  WHEN select project
  SHOULD see loaded data for this project in the table
  `, () => {
    cy.intercept(
      `GET`,
      `*/invoices/employees-entries-by-project-and-period?projectId=1&month=3&year=2026`,
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

    cy.intercept(
      `GET`,
      `*/invoices/employees-entries-by-project-and-period?projectId=1&month=3&year=2026`,
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
  })
}

function monthChangeTests() {
  it(`
  GIVEN datepicker
  WHEN user changes the month
  SHOULD update selected month and send request with this month
  `, () => {
    cy
      .getByData(`project-select`)
      .select(`1`)

    cy.intercept(
      `GET`,
      `*/invoices/employees-entries-by-project-and-period?projectId=1&month=2&year=2026`,
      {
        statusCode: 200,
        body: INVOICE_DATA, 
      },
    ) 
      .as(`getInvoices`)
    
    cy
      .getByData(`date-picker-select`)
      .click()

    cy
      .contains(`Feb`)
      .click()

    cy.wait(`@getInvoices`)
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