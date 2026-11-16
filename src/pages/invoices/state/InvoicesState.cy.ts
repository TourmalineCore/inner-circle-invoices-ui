import { InvoicesState, UNSPECIFIED_PROJECT_ID } from "./InvoicesState"

describe(`InvoicesState`, () => {
  describe(`Total Hours`, totalHoursTests)
  describe(`Total Amount`, totalAmountTests)
  describe(`Select Project`, selectProjectTests)
  describe(`Toggle Merge Selection`, toggleMergeSelectionTests)
  describe(`Is Copy Button Disabled`, isCopyButtonDisabledTests)
  describe(`Get Selected Date`, getSelectedDateTests)
})

function totalHoursTests() {
  let invoicesState: InvoicesState

  beforeEach(() => {
    invoicesState = new InvoicesState()
  })

  it(`
  GIVEN invoices table
  WHEN employees list is empty
  SHOULD return total tracked hours as 0
  `, () => {
    invoicesState.initializeInvoicesData({
      invoicesData: [],
    })

    expect(invoicesState.totalTrackedHours)
      .to
      .equal(0)

    expect(invoicesState.totalAmount)
      .to
      .equal(0)
  })

  it(`
  GIVEN an invoices table with two employees
  WHEN their tracked hours are specified
  SHOULD calculate their total hours 
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 50,
        total: 2000,
      },
      {
        employeeId: 2,
        fullName: `Jane Doe`,
        position: `Designer`,
        trackedHours: 10,
        rate: 45,
        total: 450,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })
   
    expect(invoicesState.totalTrackedHours)
      .to
      .equal(50)
  })
}

function totalAmountTests() {
  let invoicesState: InvoicesState

  beforeEach(() => {
    invoicesState = new InvoicesState()
  })

  it(`
  GIVEN all invoices have valid rates
  WHEN calculating total amount
  SHOULD return correct value
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 50,
      },
      {
        employeeId: 2,
        fullName: `Jane Smith`,
        position: `Designer`,
        trackedHours: 10,
        rate: 45,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    expect(invoicesState.totalAmount)
      .to
      .equal(2450)
  })

  it(`
  GIVEN not all rates are filled
  WHEN calculating total amount
  SHOULD return null
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 50,
      },
      {
        employeeId: 2,
        fullName: `Jane Doe`,
        position: `Designer`,
        trackedHours: 45,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    expect(invoicesState.totalAmount)
      .to
      .be
      .null
  })
}

function selectProjectTests() {
  let invoicesState: InvoicesState

  beforeEach(() => {
    invoicesState = new InvoicesState()
  })

  it(`
  GIVEN loaded projects list
  WHEN setSelectedProjectId is called with a project id
  SHOULD update selectedProjectId correctly
  `, () => {
    invoicesState.initializeProjects({
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
    })
    
    expect(invoicesState.selectedProjectId)
      .to
      .equal(UNSPECIFIED_PROJECT_ID)

    invoicesState.setSelectedProjectId({
      projectId: 1, 
    })
    expect(invoicesState.selectedProjectId)
      .to
      .equal(1)
  })
}

function toggleMergeSelectionTests() {
  let invoicesState: InvoicesState

  beforeEach(() => {
    invoicesState = new InvoicesState()
  })

  it(`
  GIVEN an invoices data with one employee
  WHEN attempting to merge the employee's hours into themselves
  SHOULD not set the mergeToEmployeeId field and not change tracked hours
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        mergeToEmployeeId: null,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    invoicesState.toggleMergeSelection({
      targetEmployeeId: 1,
      employeeIdToMerge: 1,
    })
   
    expect(invoicesState.invoicesData[0].trackedHours)
      .to
      .equal(40)

    expect(invoicesState.invoicesData[0].mergeToEmployeeId)
      .to
      .be
      .null
  })

  it(`
  GIVEN an invoices data with two employees
  WHEN merging one employee into another and then unmerging
  SHOULD update tracked hours and mergeToEmployeeId correctly
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
      },
      {
        employeeId: 2,
        fullName: `Jane Doe`,
        position: `Designer`,
        trackedHours: 40,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    invoicesState.toggleMergeSelection({
      targetEmployeeId: 1,
      employeeIdToMerge: 2,
    })
   
    expect(invoicesState.invoicesData[0].trackedHours)
      .to
      .equal(80)

    expect(invoicesState.invoicesData[1].mergeToEmployeeId)
      .to
      .be
      .eq(1)

    invoicesState.toggleMergeSelection({
      targetEmployeeId: 1,
      employeeIdToMerge: 2,
    })

    expect(invoicesState.invoicesData[0].trackedHours)
      .to
      .equal(40)

    expect(invoicesState.invoicesData[1].mergeToEmployeeId)
      .to
      .be
      .null
  })

  it(`
  GIVEN an invoices data with two employees
  WHEN one employee is merged into another
  SHOULD calculate total amount and total tracked hours correctly without duplication
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 50,
        total: 2000,
      },
      {
        employeeId: 2,
        fullName: `Jane Doe`,
        position: `Designer`,
        trackedHours: 10,
        rate: 45,
        total: 450,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    invoicesState.toggleMergeSelection({
      targetEmployeeId: 1,
      employeeIdToMerge: 2,
    })
   
    expect(invoicesState.totalTrackedHours)
      .to
      .equal(50)

    expect(invoicesState.totalAmount)
      .to
      .equal(2500)
  })
}

function isCopyButtonDisabledTests() {
  let invoicesState: InvoicesState

  beforeEach(() => {
    invoicesState = new InvoicesState()
  })

  it(`
  GIVEN an empty invoices data
  WHEN isCopyButtonDisabled is called
  SHOULD return true
  `, () => {
    invoicesState.initializeInvoicesData({
      invoicesData: [],
    })

    expect(invoicesState.isCopyButtonDisabled)
      .to
      .be
      .true
  })

  it(`
  GIVEN an invoices data with one employee
  WHEN rate is not filled
  SHOULD return true
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    expect(invoicesState.isCopyButtonDisabled)
      .to
      .be
      .true
  })

  it(`
  GIVEN an invoices data with one employee and a filled rate
  WHEN project name and purchase order number are not filled
  SHOULD return true
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 20,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    expect(invoicesState.isCopyButtonDisabled)
      .to
      .be
      .true
  })

  it(`
  GIVEN an invoices data with one employee and a filled rate
  WHEN only project name is filled
  SHOULD return true
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 20,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    invoicesState.setProjectName({
      projectName: `ProjectOne`,
    })

    expect(invoicesState.isCopyButtonDisabled)
      .to
      .be
      .true
  })

  it(`
  GIVEN an invoices data with one employee and a filled rate
  WHEN only purchase order number is filled
  SHOULD return true
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 20,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    invoicesState.setPurchaseOrderNumber({
      purchaseOrderNumber: `123`,
    })

    expect(invoicesState.isCopyButtonDisabled)
      .to
      .be
      .true
  })

  it(`
  GIVEN an invoices data with one employee and a filled rate
  WHEN project name and purchase order number are filled
  SHOULD return false
  `, () => {
    const mockInvoicesData = [
      {
        employeeId: 1,
        fullName: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 20,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    invoicesState.setProjectName({
      projectName: `ProjectOne`,
    })

    invoicesState.setPurchaseOrderNumber({
      purchaseOrderNumber: `123`,
    })

    expect(invoicesState.isCopyButtonDisabled)
      .to
      .be
      .false
  })
}

function getSelectedDateTests() {   
  it(`
  GIVEN default invoices state
  WHEN today is Nov 14 2026
  THEN selected date is Oct 2026
  `, () => {
    // in new Date, months are numbered from 0, so 10 === November
    cy.clock(new Date(2026, 10, 14), [
      `Date`,
    ])
      .then(() => {
        const invoicesState = new InvoicesState()

        // monthYearDate returns the month in the format 1–12
        // so 10 here means October
        expect(invoicesState.monthYearDate.month)
          .to
          .be
          .eq(10)

        expect(invoicesState.monthYearDate.year)
          .to
          .be
          .eq(2026)
      })
  })

  it(`
  GIVEN default invoices state
  WHEN today is Nov 15 2026 (checking the "<= 15" rule)
  THEN selected date is Oct 2026
  `, () => {
    cy.clock(new Date(2026, 10, 15), [
      `Date`,
    ])
      .then(() => {
        const invoicesState = new InvoicesState()

        expect(invoicesState.monthYearDate.month)
          .to
          .be
          .eq(10)

        expect(invoicesState.monthYearDate.year)
          .to
          .be
          .eq(2026)
      })
  })

  it(`
  GIVEN default invoices state
  WHEN today is Nov 16 2026
  THEN selected date is Nov 2026
  `, () => {
    cy.clock(new Date(2026, 10, 16), [
      `Date`,
    ])
      .then(() => {
        const invoicesState = new InvoicesState()

        expect(invoicesState.monthYearDate.month)
          .to
          .be
          .eq(11)

        expect(invoicesState.monthYearDate.year)
          .to
          .be
          .eq(2026)
      })
  })

  it(`
  GIVEN default invoices state
  WHEN today is Jan 5 2027
  THEN selected date is Dec 2026
  `, () => {
    cy.clock(new Date(2027, 0, 5), [
      `Date`,
    ])
      .then(() => {
        const invoicesState = new InvoicesState()

        expect(invoicesState.monthYearDate.month)
          .to
          .be
          .eq(12)
        
        expect(invoicesState.monthYearDate.year)
          .to
          .be
          .eq(2026)
      })
  })
}