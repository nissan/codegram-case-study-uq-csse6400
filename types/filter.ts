export interface FilterParams {
  [key: string]: number
}

export interface Filter {
  id: string
  name: string
  enabled: boolean
  params: FilterParams
}
