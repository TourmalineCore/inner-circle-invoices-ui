import { useContext, useEffect } from "react"
import { InvoicesContent } from "./InvoicesContent"
import { InvoicesStateContext } from "./state/InvoicesStateContext"

export function InvoicesContainer() {
  const invoicesState = useContext(InvoicesStateContext)
  
  useEffect(() => {
    loadInvoicesDataAsync()
    loadProjectsDataAsync()
  }, [])

  return (
    <InvoicesContent/>
  )

  async function loadProjectsDataAsync() {
    const projectsData = [
      {
        id: 1,
        name: `ProjectOne`,
      },
      {
        id: 2,
        name: `ProjectTwo`,
      },
    ]

    invoicesState.initializeProjects({
      projects : projectsData,
    })
  }

  async function loadInvoicesDataAsync() {
    const data = [
      {
        id: 1,
        name: `John Doe`,
        trackedHours: 160,
      },
      {
        id: 2,
        name: `Jane Doe`,
        trackedHours: 80,
      },
    ]
    
    invoicesState.initializeInvoicesData({
      invoicesData: data,
    })
  }
}