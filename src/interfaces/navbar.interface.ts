import React from "react"

export interface NavItem {
  title: string
  url: string
  icon?:React.ReactNode
}

export interface NavGroup {
  title: string
  url: string
  icon?: React.ReactNode
  items?: NavItem[]
}
