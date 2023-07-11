export function getToken(text) {
  const searchText = "Bearer IGT:2:"
  const startIndex = text.indexOf(searchText) + searchText.length
  const extractedText = text.substr(startIndex, 162)

  return extractedText
}
