import { useMemo } from "react"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoicesContainer } from "./InvoicesContainer"

export function InvoicesPage() {  
  const invoicesState = useMemo(
    () => new InvoicesState(),
    [],
  )
  
  return (
    <InvoicesStateContext.Provider value={invoicesState}>
      <InvoicesContainer />
    </InvoicesStateContext.Provider>
  )
}
