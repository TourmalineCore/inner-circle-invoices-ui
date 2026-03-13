import { makeAutoObservable } from 'mobx'
import { InvoiceData } from '../types'

export class InvoicesState {
  private _invoicesData: InvoiceData[] = [] 
  private _selectedDate: Date = new Date()

  constructor() {
    makeAutoObservable(this)
  }

  initialize({
    invoicesData,
  }: {
    invoicesData: InvoiceData[],
  }) {
    this._invoicesData = invoicesData
  }

  get invoicesData() {
    return this._invoicesData
  }

  get selectedDate() {
    return this._selectedDate
  }

  get totalTrackedHours() {
    return this._invoicesData.reduce((sum, invoice) => {
      const hours = invoice.trackedHours
      return sum + (isNaN(hours) ? 0 : hours)
    }, 0)
  }

  get isAllRateFieldsFilled() {
    return this._invoicesData.every(invoice => 
      invoice.rate !== null &&
      invoice.rate !== undefined,
    )
  }

  get totalAmount(): number | null {
    if (!this.isAllRateFieldsFilled) return null
    
    return this._invoicesData.reduce((sum, invoice) => {
      return sum + (invoice.rate! * invoice.trackedHours)
    }, 0)
  }

  setPosition({
    id,
    position,
  }: {
    id: number,
    position: string,
  }) {
    const invoice = this._invoicesData.find((item) => item.id == id)

    if (invoice) {
      invoice.position = position
    }
  }

  setRate({
    id,
    rate,
  }: {
    id: number,
    rate: number,
  }) {
    const invoice = this._invoicesData.find((item) => item.id == id)

    if (invoice) {
      invoice.rate = rate

      invoice.total = rate 
        ? rate * invoice.trackedHours
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
