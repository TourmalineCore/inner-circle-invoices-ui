import '@tourmalinecore/react-table-responsive/styles.css'
import './Invoices.scss'

import { observer } from "mobx-react-lite"
import { ClientTable } from '@tourmalinecore/react-table-responsive'
import { useContext } from "react"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoiceData } from "./types"
import { DatePicker } from '../../components/DatePicker/DatePicker'
import { formatThousands } from '../../common/utils/formatThousands'

export const InvoicesContent = observer(() => {
  const invoicesState = useContext(InvoicesStateContext)

  const {
    invoicesData,
    selectedDate,
    selectedProjectId,
    totalTrackedHours,
    totalAmount,
    projects,
  } = invoicesState

  const handleCopyAsText = () => {
    const invoiceText = invoicesData
      .map(({
        position,
        rate,
        trackedHours,
      } )=> {
        const total = rate! * trackedHours
        
        return `${position}: €${rate} * ${trackedHours}h = €${formatThousands(total)}`
      })
      .join(`\n`) + `\nTotal: €${formatThousands(totalAmount!)}`

    navigator.clipboard.writeText(invoiceText)
  }

  return (
    <div className='invoices'>
      <div className='invoices__head'>
        <select
          className='invoices__project-select'
          name='project'
          data-cy="project-select"
          value={selectedProjectId}
          onChange={(e) => {
            invoicesState.setSelectedProjectId({ 
              projectId: Number(e.target.value), 
            })
          }}
        >
          <option
            className='invoices__empty-project-option'
            value=""
          >
            Choose project
          </option>
          {projects.map(({
            id,
            name,
          }) => (
            <option
              data-cy="projects-select-option"
              key={id}
              value={id}
            >
              {name}
            </option>
          ))}
        </select>
        <DatePicker 
          selectedDate={selectedDate}
          onChange={(date) => {
            invoicesState.setSelectedDate({
              newDate: date,
            })
          }}
        />
      </div>
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
              data-cy={`invoices-position-input-${row.original.employeeId}`}
              defaultValue={row.original.position}
              onBlur={(e) => invoicesState.setPosition({
                employeeId: row.original.employeeId,
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
              data-cy={`invoices-rate-input-${row.original.employeeId}`}
              defaultValue={row.original.rate}
              onBlur={(e) => {
                invoicesState.setRate({
                  employeeId: row.original.employeeId,
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
            accessorFn: (row) => row.total ? formatThousands(row.total) : ``,
            footer: () => totalAmount ? formatThousands(totalAmount) : `-`,
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
        onClick={handleCopyAsText}
        disabled={totalAmount === null}
        className='invoices__copy-button'
        title={totalAmount === null ? `Fill in all rates to enable copying` : `Copy as text`}
      >
        Copy as Text
      </button>
    </div>
  )
})