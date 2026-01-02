export interface NavItem {
  title: string
  url: string
}

export interface NavGroup {
  title: string
  url: string
  items?: NavItem[]
}
