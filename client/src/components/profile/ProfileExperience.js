import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const ProfileExperience = ({ experience }) => {
  return (
    <div className="profile-exp bg-white p-2">
      <h2 className="text-primary">Experience</h2>
      {experience.length > 0 ? (
        experience.map((exp) => (
          <div key={exp._id}>
            <h3 className="text-dark">{exp.company}</h3>
            <p>
              <Moment format="DD/MM/YYYY">{exp.from}</Moment> -{' '}
              {!exp.to ? 'Now' : <Moment>{exp.to}</Moment>}
            </p>
            <p>
              <strong>Position: </strong>
              {exp.title}
            </p>
            <p>
              <strong>Description: </strong>
              {exp.description}
            </p>
          </div>
        ))
      ) : (
        <h4>No Experience Credentials</h4>
      )}
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};
export default ProfileExperience
