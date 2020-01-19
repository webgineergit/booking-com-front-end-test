import React, { useState } from 'react';
import get from 'lodash/get';

const buildFullPlaceType = (placeType) => {
  const placeTypes = {
    A: 'Airport',
    C: 'City',
    I: 'District',
    D: 'District',
    F: 'Region',
    T: 'Station',
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

export default ({
  children,
}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (term) => {
    if (term && term.length > 1) {
      setLoading(true);
      fetch(`https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=${term}`)
        .then(response => response.json())
        .then((json) => {
          let results = [];
          const rawResults = get(json, 'results.docs', []);

          if (rawResults.length) {
            results = rawResults
              .filter(result => result.name !== 'No results found')
              .map(result => ({
                id: `${result.locationId}_${result.name}`,
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

  return (
    <>
      {
        children({
          results,
          handleChange,
          loading,
        })
      }
    </>
  )
};
