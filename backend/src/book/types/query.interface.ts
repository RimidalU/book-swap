export interface QueryInterface {
  limit?: number
  offset?: number
  owner?: string
  name?: string
  author?: string
  tag?: string
  inFavorites?: boolean
  selectUser?: string
}
