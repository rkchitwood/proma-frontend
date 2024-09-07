import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/** Loading message used by components while fetching API data. */
function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;