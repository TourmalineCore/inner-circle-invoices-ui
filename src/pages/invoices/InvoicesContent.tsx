import '@tourmalinecore/react-table-responsive/styles.css'
import './Invoices.scss'

import { observer } from "mobx-react-lite"
import { ClientTable } from '@tourmalinecore/react-table-responsive'
import { useContext } from "react"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoiceData } from "./types"
import { DatePicker } from '../../components/DatePicker/DatePicker'

export const InvoicesContent = observer(() => {
  const invoicesState = useContext(InvoicesStateContext)

  const {
    invoicesData,
    selectedDate,
    totalTrackedHours,
    totalAmount,
  } = invoicesState

  return (
    <div className='invoices'>
      <DatePicker 
        selectedDate={selectedDate}
        onChange={(date) => {
          invoicesState.setSelectedDate({
            newDate: date,
          })
        }}
      />
      <ClientTable<InvoiceData>
        tableId="invoices-table"
        data={invoicesData}
        columns={[
          {
            id: `Name`,
            header: `Name`,
            accessorFn: (row) => row.name,
            footer: `Total`,
          },
          {
            id: `Position`,
            header: `Position`,
            cell: ({
              row,
            }) => <input
              defaultValue={row.original.position}
              onBlur={(e) => invoicesState.setPosition({
                id: row.original.id,
                position: e.target.value,
              })}
            />,
          },
          {
            id: `Tracked Hours`,
            header: `Tracked Hours`,
            accessorFn: (row) => row.trackedHours,
            footer: () => `${totalTrackedHours} hours`,
          },
          {
            id: `Rate`,
            header: `Rate`,
            cell: ({
              row,
            }) => <input
              type='number'
              data-cy={`invoices-rate-input-${row.original.id}`}
              defaultValue={row.original.rate}
              onBlur={(e) => {
                invoicesState.setRate({
                  id: row.original.id,
                  rate: e.target.valueAsNumber,
                })
              }}
              onKeyDown={(e) => {
                if (e.key === `e` || e.key === `E` || e.key === `+` || e.key === `-`) {
                  e.preventDefault()
                }
              }}
            />,
          },  
          {
            id: `Total`,
            header: `Total (€)`,
            accessorFn: (row) => row.total,
            footer: () => totalAmount || `-`,
          },  
        ]}
        tcOrder={{
          id: `Name`,
          desc: true,
        }}
        tcRenderMobileTitle={(row) => row.original.name}
      />
      <button
        type="button"
        data-cy="invoices-copy-button"
        disabled={invoicesState.totalAmount === null}
        className='invoices__copy-button'
      >
        Copy as Text
      </button>
    </div>
  )
})