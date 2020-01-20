import React from 'react';
import { render, act, waitForElement } from '@testing-library/react';
import { fakeServer } from 'sinon';
import LocationData from './';

const API_BASE_URL = 'http://a/url?foo=bar';

describe('LocationData', () => {
  let server;

  beforeEach(() => {
    server = fakeServer.create();
  });

  afterEach(() => {
    server.restore();
  });

  it('transforms api data into the correct model for the component API', async () => {
    const term = 'fo';
    const expectedUrl = `${API_BASE_URL}&solrTerm=${term}`;
    let proxyHandleChange = () => {};
    let proxyResults = [];

    const child = ({
      results,
      handleChange,
      loading,
    }) => {
      proxyHandleChange = ((value) => {
        act(() => {
          handleChange(value);
        })
      });

      proxyResults = results;

      return <>results: {results.length}</>;
    };

    server.respondWith(
      'GET',
      expectedUrl,
      [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
          results: {
            docs: [
              {
                index: 1,
                name: 'Fo',
                placeType: 'C',
                country: 'Bar',
              },
              {
                index: 2,
                name: 'Fo',
                placeType: 'Z',
                city: 'FooBar',
              },
              {
                name: 'Fo',
                country: 'BarFoo',
              },
            ],
          },
        }),
      ]
    );

    const {
      getByText,
    } = render(
      <LocationData
        apiBaseUrl={API_BASE_URL}
        children={child}
      />
    );

    proxyHandleChange(term);
    server.respond();

    await waitForElement(() => getByText('results: 3'));

    expect(server.requests[0].url).toBe(expectedUrl);

    expect(proxyResults[0]).toEqual({
      id: 1,
      tag: 'City',
      primaryText: 'Fo',
      secondaryText: 'Bar',
    });
    expect(proxyResults[1]).toEqual({
      id: 2,
      tag: 'Unknown',
      primaryText: 'Fo',
      secondaryText: '',
    });
    expect(proxyResults[2]).toEqual({
      id: 3,
      tag: 'Unknown',
      primaryText: 'Fo',
      secondaryText: 'BarFoo',
    });
  });

  it('does not fetch data if term is less than 2 characters', async () => {
    const term = 'f';
    let proxyHandleChange = () => {};

    const child = ({
      results,
      handleChange,
      loading,
    }) => {
      proxyHandleChange = ((value) => {
        act(() => {
          handleChange(value);
        })
      });

      return <>results: {results.length}</>;
    };

    const {
      getByText,
    } = render(
      <LocationData
        apiBaseUrl={API_BASE_URL}
        children={child}
      />
    );

    proxyHandleChange(term);
    server.respond();

    await waitForElement(() => getByText('results: 0'));

    expect(server.requests[0]).toBeUndefined();
  });
});
