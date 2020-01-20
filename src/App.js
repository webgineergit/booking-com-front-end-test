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
        <LocationData
          apiBaseUrl="https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6"
        >
          {
            ({
              handleChange,
              ...rest
            }) => (
              <LocationFinder
                onChange={handleChange}
                {...rest}
              />
            )
          }
        </LocationData>
      </div>
    </>
  );
}

export default App;
