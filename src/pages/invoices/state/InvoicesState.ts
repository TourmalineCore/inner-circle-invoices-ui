import { makeAutoObservable } from 'mobx'
import { InvoiceData } from '../types'

export class InvoicesState {
  private _invoicesData: InvoiceData[] = [] 

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
}