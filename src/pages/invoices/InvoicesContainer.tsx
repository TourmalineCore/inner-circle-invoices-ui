import { useContext, useEffect } from "react"
import { InvoicesContent } from "./InvoicesContent"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { api } from "../../common/api/api"
import { observer } from "mobx-react-lite"
import { UNSPECIFIED_PROJECT_ID } from "./state/InvoicesState"

export const InvoicesContainer = observer(() => {
  const invoicesState = useContext(InvoicesStateContext)
  
  const {
    monthYearDate,
    selectedProjectId,
    selectedDate, 
  } = invoicesState

  const {
    month,
    year,
  } = monthYearDate
  
  useEffect(() => {
    loadProjectsDataAsync()
  }, [])

  useEffect(() => {
    if (selectedProjectId !== UNSPECIFIED_PROJECT_ID) {
      loadInvoicesDataForProjectAsync({ 
        projectId: selectedProjectId, 
      })
    }
  }, [
    selectedProjectId,
    selectedDate,
  ])

  return (
    <InvoicesContent />
  )

  async function loadProjectsDataAsync() {
    const {
      data: {
        projects,
      },
    } = await api.invoicesGetAllProjects()

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
    } = await api.invoicesGetEmployeesTrackedTaskHours({
      month,
      year,
      projectId,
    })

    invoicesState.initializeInvoicesData({
      invoicesData: employeesTrackedTaskHours,
    })
  }
})