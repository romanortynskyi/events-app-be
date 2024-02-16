import supportedLanguages from 'src/consts/supported-languages'

interface GetPlaceByIdParams {
  id: string
  fields: string
  language: (typeof supportedLanguages)[number]
}

export default GetPlaceByIdParams
