import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {
  FaStar,
  FaMapMarkerAlt,
  FaSuitcase,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import SimilarJobCard from '../SimilarJobCard'
import Header from '../Header'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({status: apiStatus.loading})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const jobDetails = {
        id: data.job_details.id,
        title: data.job_details.title,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        rating: data.job_details.rating,
        location: data.job_details.location,
        employmentType: data.job_details.employment_type,
        packagePerAnnum: data.job_details.package_per_annum,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
      }

      const similarJobs = data.similar_jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        location: each.location,
        employmentType: each.employment_type,
        companyLogoUrl: each.company_logo_url,
        jobDescription: each.job_description,
      }))

      this.setState({
        jobDetails,
        similarJobs,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.fetchJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      title,
      rating,
      companyLogoUrl,
      companyWebsiteUrl,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-item-details">
        <Header />
        <div className="job-container">
          <div className="job-header-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logos"
            />
            <div className="job-title-rating">
              <h2 className="job-title">{title}</h2>
              <div className="rating-container">
                <FaStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-detail-container">
            <div className="job-location-type">
              <p>
                <FaMapMarkerAlt /> {location}
              </p>
              <p>
                <FaSuitcase /> {employmentType}
              </p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="desc-section">
            <h1 className="desc-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit <FaExternalLinkAlt />
            </a>
          </div>
          <p className="desc-details">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(skill => (
              <li className="skill-item" key={skill.name}>
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="skill-icon"
                />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-of-company-heading">Life at Company</h1>
          <div className="life-at-company">
            <p className="desc-details">{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <div className="similar-job-container">
          <h2>Similar Jobs</h2>
          <ul className="similar-jobs-list">
            {similarJobs.map(job => (
              <SimilarJobCard key={job.id} details={job} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderContent = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.loading:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return <div className="job-details-container">{this.renderContent()}</div>
  }
}

export default JobItemDetails
