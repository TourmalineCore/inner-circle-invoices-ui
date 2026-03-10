import { useContext } from "react"
import { observer } from "mobx-react-lite"
import { {{ pascalCase }}StateContext } from "./state/{{pascalCase}}StateContext"

export const {{ pascalCase }}Content = observer(() => {
  const {{ camelCase }}State = useContext({{ pascalCase }}StateContext)

  return (
    <div>
      {{ pascalCase }}
    </div>
  )
})
