import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cnames from 'classnames';
import styles from './styles.module.css';

const LocationFinder = ({
  results,
  resultLimit,
  onChange,
  loading,
}) => {
  const [value, setValue] = useState('');
  const handleChange = (event) => {
    const newValue = event.target.value;

    setValue(newValue);
    onChange(newValue.length > 1 ? newValue : '');
  };
  const hasResults = Array.isArray(results) && Boolean(results.length);
  const canShowResults = value.length > 1;
  const shouldShowNoResultsFound = !loading && canShowResults && !hasResults;
  const shouldShowResults = canShowResults && hasResults;

  return (
    <div
      className={styles.container}
    >
      <h2
        className={styles.heading}
      >
        Where are you going?
      </h2>
      <label
        className={styles.label}
        htmlFor="location-finder-input"
      >
        Pick-up Location
      </label>
      <div
        className={styles.inputContainer}
      >
        <input
          className={styles.input}
          value={value}
          onChange={handleChange}
          autoComplete="off"
          id="location-finder-input"
          type="text"
          placeholder="city, airport, station, region and district.."
          role="combobox"
          aria-expanded={!shouldShowResults && !shouldShowNoResultsFound}
          aria-controls="location-finder-list"
        />
        {
          loading && (
            <div
              className={styles.loading}
            />
          )
        }
      </div>
      {
        shouldShowResults && (
          <ul
            className={styles.list}
            role="listbox"
            id="location-finder-list"
          >
            {
              results.slice(0, resultLimit)
                .map(({ id, tag, primaryText, secondaryText }) => (
                  <li
                    className={styles.item}
                    key={id}
                  >
                    <button
                      className={styles.action}
                      aria-label={primaryText}
                    >
                      <span
                        className={styles.tag}
                        aria-hidden
                      >
                        {tag}
                      </span>
                      <div
                        className={styles.location}
                        aria-hidden
                      >
                        <span
                          className={styles.primaryText}
                          aria-hidden
                        >
                          {primaryText}
                        </span>
                        <span
                          className={styles.secondaryText}
                          aria-hidden
                        >
                          {secondaryText}
                        </span>
                      </div>
                    </button>
                  </li>
                )
              )
            }
          </ul>
        )
      }
      {
        shouldShowNoResultsFound && (
          <ul
            className={cnames(styles.list, styles.noResultsFound)}
            role="listbox"
            id="location-finder-list"
          >
            <li
              className={styles.item}
            >
              <button
                className={styles.action}
              >
                No Results found
              </button>
            </li>
          </ul>
        )
      }
    </div>
  )
};

LocationFinder.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      primaryText: PropTypes.string.isRequired,
      secondaryText: PropTypes.string.isRequired,
    }).isRequired,
  ),
  resultLimit: PropTypes.number,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
};

LocationFinder.defaultProps = {
  results: [],
  resultLimit: 6,
  onChange: () => {},
  loading: false,
};

export default LocationFinder;
