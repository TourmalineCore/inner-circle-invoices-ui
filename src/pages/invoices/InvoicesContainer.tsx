import { useContext, useEffect } from "react"
import { InvoicesContent } from "./InvoicesContent"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { api } from "../../common/api/api"
// import { InvoiceData, InvoicesApiResponse, ProjectDto } from "./types"
import { observer } from "mobx-react-lite"

export const InvoicesContainer = observer(() => {
  const invoicesState = useContext(InvoicesStateContext)
  
  useEffect(() => {
    loadProjectsDataAsync()
  }, [])

  useEffect(() => {
    if (invoicesState.selectedProjectId !== null) {
      loadInvoicesDataForProjectAsync({ 
        projectId: invoicesState.selectedProjectId, 
      })
    }
    else {
      invoicesState.initializeInvoicesData({
        invoicesData: [],
      })
    }
  }, [
    invoicesState.selectedProjectId,
    invoicesState.selectedDate,
  ])

  return (
    <InvoicesContent/>
  )

  async function loadProjectsDataAsync() {
    const {
      data: {
        projects,
      },
    } = await api.get<any>(`/api/invoices/projects`)

    invoicesState.initializeProjects({
      projects: projects,
    })
  }

  async function loadInvoicesDataForProjectAsync({
    projectId,
  }: {
    projectId: number,
  }) {
    const {
      data: {
        employeesInvoicesByProject,
      },
    } = await api.get<any>(
      `/api/invoices/?projectId=${projectId}&month=${invoicesState.monthYearDate.month}&year=${invoicesState.monthYearDate.year}`,
    )

    invoicesState.initializeInvoicesData({
      invoicesData: employeesInvoicesByProject,
    })
  }
})