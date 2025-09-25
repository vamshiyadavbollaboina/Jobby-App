import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  INITIAL: 'INITIAL',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

class UserProfile extends Component {
  state = {
    profileDetails: {},
    apiStatus: apiStatusConstants.INITIAL,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.IN_PROGRESS})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const details = data.profile_details
      const updatedDetails = {
        name: details.name,
        profileImageUrl: details.profile_image_url,
        shortBio: details.short_bio,
      }
      this.setState({
        profileDetails: updatedDetails,
        apiStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="profile-failure-view">
      <button type="button" onClick={this.getProfileDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-pic"
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="short-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.IN_PROGRESS:
        return this.renderLoading()
      case apiStatusConstants.SUCCESS:
        return this.renderSuccess()
      case apiStatusConstants.FAILURE:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderProfile()}</>
  }
}

export default UserProfile
