import {FaStar, FaMapMarkerAlt, FaSuitcase} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import './index.css'

const JobProfile = props => {
  const {jobDetails} = props
  const {
    id,
    title,
    rating,
    location,
    companyLogoUrl,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`}>
      <li className="job-card">
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="job-title-rating">
            <h1 className="job-title">{title}</h1>
            <div className="job-rating">
              <FaStar className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-details-row">
          <div className="job-location-type">
            <p className="job-location">
              <FaMapMarkerAlt className="icon" /> {location}
            </p>
            <p className="job-type">
              <FaSuitcase className="icon" /> {employmentType}
            </p>
          </div>
          <p className="job-package">{packagePerAnnum}</p>
        </div>
        <hr className="divider" />
        <h2 className="desc-heading">Description</h2>
        <p className="desc">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobProfile
