import { useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

const buildFullPlaceType = (placeType) => {
  const placeTypes = {
    A: 'Airport',
    C: 'City',
    I: 'District',
    D: 'District',
    F: 'Region',
    T: 'Station',
    P: 'Region',
  }

  return placeTypes[placeType] || 'Unknown';
};

const buildLocation = (city, country) => {
  let location = '';

  if (city && country) {
    location = `${city}, ${country}`;
  } else if (country) {
    location = country;
  }

  return location;
};

const apiUrlSeparator = (url) =>
  url.includes('?') && !url.endsWith('?') ? '&' : '?';

const LocationData = ({
  children,
  apiBaseUrl,
}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (term) => {
    if (term && term.length > 1) {
      setLoading(true);
      fetch(`${apiBaseUrl}${apiUrlSeparator(apiBaseUrl)}solrTerm=${term}`)
        .then(response => response.json())
        .then((json) => {
          const rawResults = get(json, 'results.docs', []);
          let results = [];

          if (rawResults.length) {
            results = rawResults
              .filter(result => result.name !== 'No results found')
              .map((result, index) => ({
                id: result.index || index + 1,
                tag: buildFullPlaceType(result.placeType),
                primaryText: result.name,
                secondaryText: buildLocation(result.city, result.country),
              }));
          }

          setResults(results);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  };

  return children({
    results,
    handleChange,
    loading,
  });
};

LocationData.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default LocationData;
