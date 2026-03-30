import '@tourmalinecore/react-table-responsive/styles.css'
import './Invoices.scss'

import { observer } from "mobx-react-lite"
import { ClientTable } from '@tourmalinecore/react-table-responsive'
import { useContext, useState } from "react"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { InvoiceData } from "./types"
import { DatePicker } from '../../components/DatePicker/DatePicker'
import { formatThousands } from '../../common/utils/formatThousands'
import { UNSPECIFIED_PROJECT_ID } from './state/InvoicesState'

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

  const [
    isCopied,
    setIsCopied,
  ] = useState(false)

  const handleCopyAsText = () => {
    const invoiceText = invoicesData
      .map(({
        position,
        rate,
        trackedHours,
        total,
      } )=> {
        return `${position || `-`}: €${rate} * ${trackedHours}h = €${formatThousands(total!)}`
      })
      .join(`\n`) + `\nTotal: €${formatThousands(totalAmount!)}`

    navigator.clipboard.writeText(invoiceText)

    setIsCopied(true)
    
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const isCopyButtonDisabled = totalAmount === null || invoicesData.length < 1

  return (
    <div 
      className='invoices'
      data-cy='invoices'
    >
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
            value={UNSPECIFIED_PROJECT_ID}
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
              className='invoices__input'
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
              className='invoices__input'
              data-cy={`invoices-rate-input-${row.original.employeeId}`}
              defaultValue={row.original.rate}
              onBlur={(e) => {
                invoicesState.setRate({
                  employeeId: row.original.employeeId,
                  rate: e.target.valueAsNumber,
                })
              }}
              onKeyDown={preventInvalidNumberInput}
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
        disabled={isCopyButtonDisabled}
        className='invoices__copy-button'
        title={isCopyButtonDisabled ? `Fill in all rates to enable copying` : `Copy as text`}
      >
        {isCopied ? `Copied!` : `Copy as Text`}
      </button>
    </div>
  )
})

function preventInvalidNumberInput(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === `e` || e.key === `E` || e.key === `+` || e.key === `-`) {
    e.preventDefault()
  }
}
