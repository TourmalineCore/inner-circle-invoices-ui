import { useContext } from "react"
import { observer } from "mobx-react-lite"
import { {{pascalCase}}StateContext } from "./state/{{pascalCase}}StateContext"
import { {{pascalCase}}Content } from "./{{pascalCase}}Content"

export const {{pascalCase}}Container = observer(() => {
  const {{camelCase}}State = useContext({{pascalCase}}StateContext)

  return (
    <{{pascalCase}}Content />
  )
})
