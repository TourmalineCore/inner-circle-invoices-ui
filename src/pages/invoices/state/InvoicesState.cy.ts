import { InvoicesState } from "./InvoicesState"

describe(`InvoicesState`, () => {
  describe(`Total Hours`, totalHoursTests)
  describe(`Total Amount`, totalAmountTests)
})

function totalHoursTests() {
  let invoicesState: InvoicesState

  beforeEach(() => {
    invoicesState = new InvoicesState()
  })

  it(`
  GIVEN invoices table
  WHEN emoloyees list is empty
  SHOULD return total tracked hours as 0
  `, () => {
    invoicesState.initializeInvoicesData({
      invoicesData: [],
    })

    expect(invoicesState.totalTrackedHours).to.equal(0)
  })

  it(`
  GIVEN an invoices table with two employees
  WHEN their tracked hours are specified
  SHOULD calculate their total hours 
  `, () => {
    const mockInvoicesData = [
      {
        id: 1,
        name: `John Doe`,
        position: `developer`,
        trackedHours: 40,
        rate: 50,
        total: 2000,
      },
      {
        id: 2,
        name: `Jane Doe`,
        position: `designer`,
        trackedHours: 10,
        rate: 45,
        total: 450,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })
   
    expect(invoicesState.totalTrackedHours).to.equal(50)
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
        id: 1,
        name: `John Doe`,
        position: `Developer`,
        trackedHours: 40,
        rate: 50,
      },
      {
        id: 2,
        name: `Jane Smith`,
        position: `Designer`,
        trackedHours: 10,
        rate: 45,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    expect(invoicesState.totalAmount).to.equal(2450)
  })

  it(`
  GIVEN an empty invoices array
  WHEN calculating total amount
  SHOULD return 0
  `, () => {
    invoicesState.initializeInvoicesData({
      invoicesData: [],
    })

    expect(invoicesState.totalAmount).to.equal(0)
  })

  it(`
  GIVEN not all rates are filled
  WHEN calculating total amount
  SHOULD return null
  `, () => {
    const mockInvoicesData = [
      {
        id: 1,
        name: `John Doe`,
        position: `developer`,
        trackedHours: 40,
        rate: 50,
      },
      {
        id: 2,
        name: `Jane Doe`,
        position: `designer`,
        trackedHours: 45,
        rate: undefined,
      },
    ]

    invoicesState.initializeInvoicesData({
      invoicesData: mockInvoicesData,
    })

    expect(invoicesState.totalAmount).to.be.null
  })
}