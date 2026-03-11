import { {{pascalCase}}Content } from "./{{pascalCase}}Content"
import { {{pascalCase}}State } from "./state/{{pascalCase}}State"
import { {{pascalCase}}StateContext } from "./state/{{pascalCase}}StateContext"

describe(`{{pascalCase}}Content`, () => {
  it(`
  GIVEN component
  WHEN render
  SHOULD see it
  `, () => {
    mountComponent()
  })
})

function mountComponent() {
  const {{camelCase}}State = new {{pascalCase}}State()

  cy.mount(
    <{{pascalCase}}StateContext.Provider value={{{camelCase}}State}>
      <{{pascalCase}}Content />
    </{{pascalCase}}StateContext.Provider>,
  )
}
