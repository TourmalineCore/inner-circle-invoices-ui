import { InvoicesState } from "./InvoicesState"

describe(`InvoicesState`, () => {
  describe(`Total Hours`, totalHoursTests)
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
    invoicesState.initialize({
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

    invoicesState.initialize({
      invoicesData: mockInvoicesData,
    })
   
    expect(invoicesState.totalTrackedHours).to.equal(50)
  })
}