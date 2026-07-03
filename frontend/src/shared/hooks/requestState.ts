export interface RequestState<ResponseData> {
  data?: ResponseData
  isLoading: boolean
  errorMessage: string
  reload: () => Promise<void>
}
