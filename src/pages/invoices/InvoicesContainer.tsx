import { useContext, useEffect } from "react"
import { InvoicesContent } from "./InvoicesContent"
import { InvoicesStateContext } from "./state/InvoicesStateContext"

export function InvoicesContainer() {
  const invoicesState = useContext(InvoicesStateContext)
  
  useEffect(() => {
    loadInvoicesDataAsync()
  }, [])

  return (
    <InvoicesContent/>
  )

  async function loadInvoicesDataAsync() {
    const data = [
      {
        name: `John Doe`,
        trackedHours: 160,
      },
      {
        name: `Jane Doe`,
        trackedHours: 80,
      },
    ]
    
    invoicesState.initialize({
      invoicesData: data,
    })
  }
}