import {FaStar, FaMapMarkerAlt, FaSuitcase} from 'react-icons/fa'
import './index.css'

const SimilarJobCard = props => {
  const {details} = props
  const {
    title,
    companyLogoUrl,
    rating,
    location,
    employmentType,
    jobDescription,
  } = details

  return (
    <li className="similar-job-card">
      <div className="similar-job-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="similar-job-title-rating">
          <h1 className="similar-job-title-rating-heading">{title}</h1>
          <div className="similar-job-rating">
            <FaStar className="star" />
            <p>{rating}</p>
          </div>
        </div>
      </div>

      <h2 className="similar-job-desc-heading">Description</h2>
      <p className="similar-job-desc">{jobDescription}</p>
      <div className="similar-job-details-row">
        <div className="similar-job-location-type">
          <p className="similar-icon-container">
            <FaMapMarkerAlt className="similar-job-icon" /> {location}
          </p>
          <p className="similar-job-icon-container">
            <FaSuitcase className="similar-job-icon" /> {employmentType}
          </p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
