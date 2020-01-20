This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites
yarn `~1.19.1`

If you don't already have `yarn`, full instructions can be found on the official [yarn installation page](https://yarnpkg.com/en/docs/install).

### Run `yarn` first

To install all the project dependencies.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

## IE support
`create-react-app` in development mode doesn't play well with older IE versions; if you want to view the app in IE versions 10+, you can run `yarn build`, then once that is complete you can follow in-terminal instructions to use the `serve` package. This will enable you to view the full production app even in IE 10.

## Note about the search API endpoint
The coding test instructions provided a URL to use as an enpoint for building the experience: https://cors.io/?https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&amp;solrRows={number_of_results_required}&amp;solrTerm={search_term}. I'm assuming this was to act as a proxy for the endpoint to prevent any CORS errors. However, the cors.io service is not operational (at least where I am writing this currently in Australia). I was going to use my own proxy for the test, then I found that `https://www.rentalcars.com/FTSAutocomplete.do` is augmenting the response headers with a convinient `access-control-allow-origin` set dynamically to the request origin host, e.g. in the case of create react app: `localhost:3000`.
So it works without the proxy! Let me know if there are any issues and I'll be happy to set-up a proxy for the purposes of this test.
