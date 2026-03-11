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
}
