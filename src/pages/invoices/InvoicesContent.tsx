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
import { MultipleSelect } from '../../components/multiple-select/MultipleSelect'

export const InvoicesContent = observer(() => {
  const invoicesState = useContext(InvoicesStateContext)

  const {
    invoicesData,
    selectedDate,
    selectedProjectId,
    totalTrackedHours,
    totalAmount,
    projects,
    purchaseOrderNumber,
    projectName,
    isCopyButtonDisabled,
  } = invoicesState

  const [
    isCopied,
    setIsCopied,
  ] = useState(false)

  const handleCopyAsText = () => {
    const invoiceText = invoicesData
      .filter((invoice) => !invoice.mergeToEmployeeId)
      .map(({
        position,
        rate,
        trackedHours,
        total,
      } )=> {
        return `${position!.trim() || `-`}: €${rate} * ${trackedHours}h = €${formatThousands(total!)}`
      })
      .join(`\n`) + `\nTotal: €${formatThousands(totalAmount!)}`

    const monthName = selectedDate.toLocaleString(`en-US`, {
      month: `long`, 
    })

    const year = selectedDate.getFullYear()

    navigator.clipboard.writeText(`PO ${purchaseOrderNumber.trim()}; Period: ${monthName} ${year}; Project: ${projectName.trim()};\n` + invoiceText)

    setIsCopied(true)
    
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const invoicesDataWithoutMergedEmployees = invoicesData.filter((invoice) => !invoice.mergeToEmployeeId)

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
        <input
          data-cy='invoices-purchase-order-number-input'
          placeholder='Purchase order number'
          onChange={(e) => invoicesState.setPurchaseOrderNumber({
            purchaseOrderNumber: e.target.value,
          })}
        />
        <input
          data-cy='invoices-project-name-input'
          placeholder='Project name'
          onChange={(e) => invoicesState.setProjectName({
            projectName: e.target.value,
          })}
        />
      </div>
      <ClientTable<InvoiceData>
        tableId="invoices-table"
        data={invoicesDataWithoutMergedEmployees}
        columns={[
          {
            id: `Name`,
            header: `Name`,
            accessorFn: (row) => row.fullName,
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
            tcNoFooterColumn: true,
          },
          {
            id: `Tracked Hours`,
            header: `Tracked Hours`,
            cell: ({
              row,
            }) => (
              <span data-cy="invoices-tracked-hours">
                {row.original.trackedHours}
              </span>
            ),
            footer: () => `${totalTrackedHours} hours`,
            size: 80,
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
            minSize: 40,
            size: 40,
            tcNoFooterColumn: true,
          },  
          {
            id: `Total`,
            header: `Total (€)`,
            accessorFn: (row) => row.total ? formatThousands(row.total) : ``,
            footer: () => totalAmount ? formatThousands(totalAmount) : `-`,
            minSize: 50,
            size: 50,
          },
          {
            id: `Merge Hours`,
            header: `Merge Hours`,
            size: 200,
            cell: ({
              row,
            }) => {
              const currentEmployeeId = row.original.employeeId

              const otherEmployees = invoicesData.filter(
                (invoice) => invoice.employeeId !== currentEmployeeId
                && (!invoice.mergeToEmployeeId || invoice.mergeToEmployeeId === currentEmployeeId),
              )

              const selectedMergeIds = invoicesData
                .filter((invoice) => invoice.mergeToEmployeeId === currentEmployeeId)
                .map(({
                  employeeId,
                }) => employeeId)

              const options = otherEmployees.map(({
                employeeId,
                fullName,
              }) => ({
                value: employeeId,
                label: shortenName({
                  fullName,
                }),
              }))

              return (
                <div className="invoices__merge-select-container">
                  <MultipleSelect
                    className="invoices__merge-select"
                    placeholder="Merge with"
                    data-cy='invoices-merge-select'
                    value={selectedMergeIds}
                    options={options}
                    onChange={(selectedOptions) => {
                      const newSelectedIds = selectedOptions.map(({
                        value, 
                      }) => value as number)

                      selectedMergeIds
                        .filter((id) => !newSelectedIds.includes(id))
                        .forEach((id) => {
                          invoicesState.toggleMergeSelection({
                            targetEmployeeId: currentEmployeeId,
                            employeeIdToMerge: id,
                          })
                        })

                      newSelectedIds
                        .filter((id) => !selectedMergeIds.includes(id))
                        .forEach((id) => {
                          invoicesState.toggleMergeSelection({
                            targetEmployeeId: currentEmployeeId,
                            employeeIdToMerge: id,
                          })
                        })
                    }}
                  />
                </div>
              )
            },
          },  
        ]}
        tcOrder={{
          id: `Name`,
          desc: true,
        }}
        tcRenderMobileTitle={(row) => row.original.fullName}
      />
      <button
        type="button"
        data-cy="invoices-copy-button"
        onClick={handleCopyAsText}
        disabled={isCopyButtonDisabled}
        className='invoices__copy-button'
        title={isCopyButtonDisabled ? `Fill in all required fields to enable copying` : `Copy as text`}
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

function shortenName({
  fullName,
}: {
  fullName: string,
}) {
  const parts = fullName.trim()
    .split(/\s+/)

  if (parts.length < 2) {
    return fullName
  } 

  return `${parts[0]} ${parts[1][0]}.`
}
