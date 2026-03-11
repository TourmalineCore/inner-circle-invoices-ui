import { makeAutoObservable } from "mobx"

export class {{pascalCase}}State {
  private _value: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  get value() {
    return this._value
  }

  changeValue({
    newValue,
  }: {
    newValue: number,
  }) {
    this._value = newValue
  }
}
