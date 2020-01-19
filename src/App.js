import React from 'react';
import LocationData from './containers/LocationData';
import LocationFinder from './components/LocationFinder';
import styles from './styles.module.css';

function App() {
  return (
    <>
      <div
        className={styles.search}
      >
        <LocationData>
          {
            ({
              results,
              handleChange,
              loading,
            }) => (
              <LocationFinder
                results={results}
                onChange={handleChange}
                loading={loading}
              />
            )
          }
        </LocationData>
      </div>
    </>
  );
}

export default App;
