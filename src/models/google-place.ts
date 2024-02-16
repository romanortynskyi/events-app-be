import AddressComponent from './address-component'
import DisplayName from './display-name'
import Location from './location'

class GooglePlace {
  id: string
  displayName: DisplayName
  googleMapsUri: string
  location: Location
  addressComponents: AddressComponent[]
}

export default GooglePlace
