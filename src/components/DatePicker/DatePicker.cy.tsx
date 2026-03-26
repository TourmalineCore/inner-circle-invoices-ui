import { DatePicker } from "./DatePicker"

describe(`DatePicker`, () => {
  it(`
  GIVEN date picker component 
  WHEN mount
  SHOULD render date picker component
  `, () => {
    mountComponent()

    cy
      .getByData(`date-picker`)
      .should(`exist`)
  })

  it(`
  GIVEN date picker component 
  WHEN select next year
  SHOULD render correct date
  `, () => {
    mountComponent()

    cy
      .getByData(`date-picker`)
      .click()

    cy
      .get(`[aria-label="Next Year"]`)
      .click()

    cy
      .contains(`Jan`)
      .click()

    cy
      .get(`@onChange`)
      .should(`have.been.calledOnce`)
  })
})

function mountComponent() {
  const onChange = cy.spy()
    .as(`onChange`)

  cy.mount(
    <DatePicker
      selectedDate={new Date(`2023-08-1`)}
      onChange={onChange}
    />,
  )
}