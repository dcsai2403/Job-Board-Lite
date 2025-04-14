import React from 'react';

const JobCard = ({ job }) => (
  <div className="border p-4 rounded shadow-md bg-white">
    <h3 className="text-lg font-bold">{job.title}</h3>
    <p className="text-gray-700">{job.description}</p>
    <p className="text-sm text-gray-500 mt-2">Posted by: {job.company}</p>
  </div>
);

export default JobCard;
