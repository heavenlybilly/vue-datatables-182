export default function getItemsByPage(items: any[], page: number, rowsPerPage: number) {
  if (page < 1 || rowsPerPage < 1) return []

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  return items.slice(startIndex, endIndex)
}
