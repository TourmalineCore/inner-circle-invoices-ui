import { useContext, useEffect } from "react"
import { InvoicesContent } from "./InvoicesContent"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { api } from "../../common/api/api"
import { InvoiceData, ProjectDto } from "./types"
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
      data,
    } = await api.get<ProjectDto[]>(`/api/invoices/projects`)

    invoicesState.initializeProjects({
      projects: data,
    })
  }

  async function loadInvoicesDataForProjectAsync({
    projectId,
  }: {
    projectId: number,
  }) {
    const {
      data,
    } = await api.get<InvoiceData[]>(
      `/api/invoices/?projectId=${projectId}&month=${invoicesState.monthYearDate.month}&year=${invoicesState.monthYearDate.year}`,
    )

    invoicesState.initializeInvoicesData({
      invoicesData: data,
    })
  }
})