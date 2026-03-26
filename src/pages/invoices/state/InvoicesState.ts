import { makeAutoObservable } from 'mobx'
import { InvoiceData, ProjectDto } from '../types'
import { formatToTwoDecimalPlaces } from '../../../common/utils/formatToTwoDecimalPlaces'

export const UNSPECIFIED_PROJECT_ID = 0

export class InvoicesState {
  private _invoicesData: InvoiceData[] = [] 
  private _selectedDate = new Date()
  private _projects: ProjectDto[] = []
  private _selectedProjectId = UNSPECIFIED_PROJECT_ID 

  constructor() {
    makeAutoObservable(this)
  }

  initializeInvoicesData({
    invoicesData,
  }: {
    invoicesData: InvoiceData[],
  }) {
    this._invoicesData = invoicesData.map((item) => ({
      ...item,
      trackedHours: formatToTwoDecimalPlaces(item.trackedHours),
    }))
  }

  initializeProjects({
    projects,
  }: {
    projects: ProjectDto[],
  }) {
    this._projects = projects
  }

  get projects() {
    return this._projects
  }

  get selectedProjectId() {
    return this._selectedProjectId
  }

  get invoicesData() {
    return this._invoicesData
  }

  get selectedDate() {
    return this._selectedDate
  }

  get monthYearDate() {
    const month = this._selectedDate.getMonth() + 1
    const year = this._selectedDate.getFullYear()
    return {
      month,
      year,
    }
  }

  get totalTrackedHours() {
    return this._invoicesData.reduce((sum, invoice) => {
      return formatToTwoDecimalPlaces(sum + invoice.trackedHours)
    }, 0)
  }

  get totalAmount() {
    const allRatesValid = this._invoicesData.every((invoice) => 
      invoice.rate != null &&
      invoice.rate !== undefined &&
      !isNaN(invoice.rate),
    )
  
    if (!allRatesValid) {
      return null
    }
    
    const totalAmount = this._invoicesData.reduce((sum, invoice) => {
      return sum + (invoice.rate! * invoice.trackedHours)
    }, 0)

    return formatToTwoDecimalPlaces(totalAmount)
  }
  
  setSelectedProjectId({
    projectId,
  }: {
    projectId: number, 
  }) {
    this._selectedProjectId = projectId
  }
  
  setPosition({
    employeeId,
    position,
  }: {
    employeeId: number,
    position: string,
  }) {
    const invoice = this._invoicesData.find((item) => item.employeeId == employeeId)

    if (invoice) {
      invoice.position = position
    }
  }

  setRate({
    employeeId,
    rate,
  }: {
    employeeId: number,
    rate: number,
  }) {
    const invoice = this._invoicesData.find((item) => item.employeeId == employeeId)

    if (invoice) {
      invoice.rate = rate

      invoice.total = rate 
        ? formatToTwoDecimalPlaces(rate * invoice.trackedHours)
        : null
      
      // trigger reload state
      this._invoicesData = [
        ...this._invoicesData,
      ]
    }
  }

  setSelectedDate({
    newDate,
  }: {
    newDate: Date,
  }) {
    this._selectedDate = newDate
  }
}
