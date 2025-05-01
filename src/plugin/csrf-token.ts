let csrfToken: string | undefined

export const setCsrfToken = (value: string) => {
  csrfToken = value
}

export const getCsrfToken = () => csrfToken
