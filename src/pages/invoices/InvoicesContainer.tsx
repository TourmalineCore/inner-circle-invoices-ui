import { useContext, useEffect } from "react"
import { InvoicesContent } from "./InvoicesContent"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { api } from "../../common/api/api"
import { InvoicesApiResponse, ProjectsApiResponse } from "./types"
import { observer } from "mobx-react-lite"
import { UNSPECIFIED_PROJECT_ID } from "./state/InvoicesState"

export const InvoicesContainer = observer(() => {
  const invoicesState = useContext(InvoicesStateContext)
  
  useEffect(() => {
    loadProjectsDataAsync()
  }, [])

  useEffect(() => {
    if (invoicesState.selectedProjectId !== UNSPECIFIED_PROJECT_ID) {
      loadInvoicesDataForProjectAsync({ 
        projectId: invoicesState.selectedProjectId, 
      })
    }
  }, [
    invoicesState.selectedProjectId,
    invoicesState.selectedMonth,
  ])

  return (
    <InvoicesContent/>
  )

  async function loadProjectsDataAsync() {
    const {
      data: {
        projects,
      },
    } = await api.get<ProjectsApiResponse>(`/api/invoices/projects`)

    invoicesState.initializeProjects({
      projects,
    })
  }

  async function loadInvoicesDataForProjectAsync({
    projectId,
  }: {
    projectId: number,
  }) {
    const {
      data: {
        employeesTrackedTaskHours,
      },
    } = await api.get<InvoicesApiResponse>(
      `/api/invoices/employees-entries-by-project-and-period?projectId=${projectId}&month=${invoicesState.monthYearDate.month}&year=${invoicesState.monthYearDate.year}`,
    )

    invoicesState.initializeInvoicesData({
      invoicesData: employeesTrackedTaskHours,
    })
  }
})