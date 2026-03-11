import { useMemo } from "react"
import { InvoicesState } from "./state/InvoicesState"
import { InvoicesStateContext } from "./state/InvoicesStateContext"

export function InvoicesPage() {  
  const invoicesState = useMemo(
    () => new InvoicesState(),
    [],
  )
  return (
    <InvoicesStateContext.Provider value={invoicesState}>
      <div>Invoices</div>
    </InvoicesStateContext.Provider>
  )
}
