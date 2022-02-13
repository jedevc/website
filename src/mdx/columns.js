import React from "react"

export function Columns({ children }) {
  return <div className="columns is-centered is-vcentered">{children}</div>
}

export function Column({ children, size }) {
  return <div className={`column ${size ? `is-${size}` : ""}`}>{children}</div>
}
