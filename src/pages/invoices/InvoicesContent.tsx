import '@tourmalinecore/react-table-responsive/styles.css'

import { observer } from "mobx-react-lite"
import { ClientTable } from '@tourmalinecore/react-table-responsive'
import { useContext } from "react"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoiceData } from "./types"

export const InvoicesContent = observer(() => {
  const invoicesState = useContext(InvoicesStateContext)

  return (
    <ClientTable<InvoiceData>
      tableId="invoices-table"
      data={invoicesState.invoicesData}
      columns={[
        {
          id: `Name`,
          header: `Name`,
          accessorFn: (row) => row.name,
        },
        {
          id: `Position`,
          header: `Position`,
          accessorFn: (row) => row.position,
        },
        {
          id: `Tracked Hours`,
          header: `Tracked Hours`,
          accessorFn: (row) => row.trackedHours,
        },
        {
          id: `Rate`,
          header: `Rate`,
          accessorFn: (row) => row.rate,
        },
        {
          id: `Total`,
          header: `Total`,
          accessorFn: (row) => row.total,
        },  
      ]}
      tcOrder={{
        id: `Name`,
        desc: true,
      }}
      tcRenderMobileTitle={(row) => row.original.name}
    />
  )
})