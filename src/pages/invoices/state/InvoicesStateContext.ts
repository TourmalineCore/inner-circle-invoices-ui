import { createContext } from "react"
import { InvoicesState } from "./InvoicesState"

export const InvoicesStateContext = createContext<InvoicesState>(null as unknown as InvoicesState)
