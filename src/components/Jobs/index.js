import {Component} from 'react'
import {FaSearch} from 'react-icons/fa'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobProfile from '../JobProfile'
import UserProfile from '../UserProfile'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  INITIAL: 'INITIAL',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

class Jobs extends Component {
  state = {
    employmentTypes: {
      FULLTIME: false,
      PARTTIME: false,
      FREELANCE: false,
      INTERNSHIP: false,
    },
    salaryRange: '',
    searchinput: '',
    jobsList: [],
    apiStatus: apiStatusConstants.INITIAL,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.IN_PROGRESS})
    const {employmentTypes, salaryRange, searchinput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const selectedEmploymentTypes = Object.keys(employmentTypes)
      .filter(type => employmentTypes[type])
      .join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypes}&minimum_package=${salaryRange}&search=${searchinput}`

    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        location: each.location,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  handleEmploymentChange = event => {
    const {id, checked} = event.target
    this.setState(
      prevState => ({
        employmentTypes: {
          ...prevState.employmentTypes,
          [id]: checked,
        },
      }),
      this.getJobDetails,
    )
  }

  handleSalaryChange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobDetails)
  }

  handleSearchChange = event => {
    this.setState({searchinput: event.target.value})
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1 className="no-jobs">No Jobs Found</h1>
          <p className="des">We could not find any jobs. Try other filters.</p>
        </div>
      )
    }
    return (
      <ul className="jobs_profiles">
        {jobsList.map(each => (
          <JobProfile key={each.id} jobDetails={each} />
        ))}
      </ul>
    )
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.IN_PROGRESS:
        return this.renderLoading()
      case apiStatusConstants.SUCCESS:
        return this.renderJobsList()
      case apiStatusConstants.FAILURE:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {employmentTypes, salaryRange, searchinput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-filter-section">
            <UserProfile />
            <hr />
            <div className="filter-section">
              <h3>Type of Employment</h3>
              <ul className="type-of-employee-container">
                {employmentTypesList.map(item => (
                  <li className="employee-type" key={item.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={item.employmentTypeId}
                      checked={employmentTypes[item.employmentTypeId]}
                      onChange={this.handleEmploymentChange}
                    />
                    <label htmlFor={item.employmentTypeId}>{item.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="filter-section">
              <h3 className="filter-heading">Salary Range</h3>
              <ul className="salary-container">
                {salaryRangesList.map(item => (
                  <li className="salary" key={item.salaryRangeId}>
                    <input
                      type="radio"
                      name="salary"
                      id={item.salaryRangeId}
                      value={item.salaryRangeId}
                      checked={salaryRange === item.salaryRangeId}
                      onChange={this.handleSalaryChange}
                    />
                    <label htmlFor={item.salaryRangeId}>{item.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="job-profile-container">
            <div className="search-bar">
              <input
                type="search"
                placeholder="search"
                className="search-bar-style"
                value={searchinput}
                onChange={this.handleSearchChange}
              />
              <button
                type="button"
                className="search-button"
                onClick={this.getJobDetails}
                data-testid="searchButton"
              >
                <FaSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
