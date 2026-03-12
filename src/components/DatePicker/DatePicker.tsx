import './DatePicker.scss'
import 'react-datepicker/dist/react-datepicker.css'

import { HTMLProps, forwardRef } from 'react'
import { DatePicker as ReactDatePicker } from 'react-datepicker'
import CalendarIcon from '../../assets/icons/calendar-icon.svg?react'

const DatePickerCustomElement = forwardRef<HTMLButtonElement, HTMLProps<HTMLButtonElement>>(({
  value, onClick,
}, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="date-picker__button"
    data-cy="date-picker-select"
  >
    <CalendarIcon/>
    <span data-cy="date-picker-result">{value}</span>
    <span className="date-picker__arrow">&or;</span>
  </button>
))

export function DatePicker({
  selectedDate, 
  onChange,
}: {
  selectedDate: Date, 
  onChange: (date: Date) => unknown,
}){
  return (
    <div
      className="date-picker"
      data-cy="date-picker"
    >
      <ReactDatePicker
        selected={selectedDate}
        onChange={(date) => onChange(
          date as Date,
        )}
        showMonthYearPicker
        dateFormat="MMM yyyy"
        customInput={<DatePickerCustomElement />}
      />
    </div>
  )
}
