import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LocationFinder from './';

const moreThan6Results = [
  { id: 'abc', tag: '', primaryText: 'Foo', secondaryText: '', },
  { id: 'def', tag: '', primaryText: 'Bar', secondaryText: '', },
  { id: 'ghi', tag: '', primaryText: 'Foo Bar', secondaryText: '', },
  { id: 'jkl', tag: '', primaryText: 'Bar Foo', secondaryText: '', },
  { id: 'mno', tag: '', primaryText: 'Foo Bar Foo', secondaryText: '', },
  { id: 'pqr', tag: '', primaryText: 'Bar Foo Bar', secondaryText: '', },
  { id: 'stu', tag: '', primaryText: 'Bar Bar Foo', secondaryText: '', },
];

describe('LocationFinder', () => {
  describe('initially', () => {
    it('renders', () => {
      const { getByText } = render(<LocationFinder />);

      expect(getByText('Where are you going?')).toBeTruthy();
    });

    it('is accompanied by the correct label', () => {
      const { getByLabelText } = render(<LocationFinder />);

      expect(getByLabelText('Pick-up Location')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('describes itself as a textbox', () => {
      const { getByRole } = render(<LocationFinder />);

      expect(getByRole('combobox')).toBeTruthy();
    });

    it('has the correct placeholder text', () => {
      const { getByPlaceholderText } = render(<LocationFinder />);

      expect(getByPlaceholderText('city, airport, station, region and district..')).toBeTruthy();
    });
  });

  describe('interactivity', () => {
    describe('touching the input', () => {
      it('focuses on the input', () => {
        const { getByRole } = render(<LocationFinder />);
        const input = getByRole('combobox');

        input.focus();

        expect(document.activeElement).toBe(input);
      });
    });

    describe('single alphanumeric character entered', () => {
      it('removes placeholder text', () => {
        const { getByRole } = render(<LocationFinder />);
        const input = getByRole('combobox');

        fireEvent.change(input, { target: { value: 'f' } });

        expect(input.value).toBe('f');
      });

      it('shows no search results', () => {
        let results = [];
        const responses = { f: moreThan6Results };
        const handleChange = (value) => {
          results = responses[value];
        };
        const {
          queryByRole,
          getByRole,
        } = render(
          <LocationFinder onChange={handleChange} results={results} />
        );
        const input = getByRole('combobox');

        fireEvent.change(input, { target: { value: 'f' } });

        expect(queryByRole('listbox')).toBeNull();
      });
    });

    describe('multiple alphanumeric characters entered', () => {
      it('removes the placeholder text', () => {
        const { getByRole } = render(<LocationFinder />);
        const input = getByRole('combobox');

        fireEvent.change(input, { target: { value: 'fo' } });

        expect(input.value).toBe('fo');
      });

      describe('has no results for entry', () => {
        it('displays no results found message', () => {
          let results = [];
          const responses = { fo: [] };
          const handleChange = (value) => {
            results = responses[value];
          };
          const {
            getByRole,
            rerender,
          } = render(
            <LocationFinder onChange={handleChange} results={[]} />
          );
          const input = getByRole('combobox');

          fireEvent.change(input, { target: { value: 'fo' } });

          rerender(<LocationFinder results={results} />);

          expect(getByRole('listbox').children.length).toBe(1);
          expect(getByRole('listbox').children[0].innerHTML).toBe('No Results found');
        });
      });

      describe('has some results for entry', () => {
        it('displays a maximum of 6 results', () => {
          let results = [];
          const responses = { fo: moreThan6Results };
          const handleChange = (value) => { results = responses[value] };
          const {
            getByRole,
            rerender,
          } = render(<LocationFinder onChange={handleChange} results={[]} />);
          const input = getByRole('combobox');

          fireEvent.change(input, { target: { value: 'fo' } });

          rerender(<LocationFinder onChange={handleChange} results={results} />);

          expect(getByRole('listbox').children.length).toBe(6);
        });
      });

      describe('change entry back to a single alphanumeric character', () => {
        it('shows no search results', () => {
          let results = [];
          const responses = { fo: moreThan6Results, f: moreThan6Results };
          const handleChange = (value) => { results = responses[value] };
          const {
            getByRole,
            queryByRole,
            rerender,
          } = render(<LocationFinder onChange={handleChange} results={[]} />);
          const input = getByRole('combobox');

          fireEvent.change(input, { target: { value: 'fo' } });

          rerender(<LocationFinder onChange={handleChange} results={results} />);

          expect(getByRole('listbox').children.length).toBe(6);

          fireEvent.change(input, { target: { value: 'f' } });

          rerender(<LocationFinder onChange={handleChange} results={results} />);

          expect(queryByRole('listbox')).toBeNull();
        });
      });
    });
  });
});
