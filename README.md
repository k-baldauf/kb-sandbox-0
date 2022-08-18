# Restaurant Search via TableCheck's SPA Boilerplate

DEMO: [tc-spa-boilerplate.netlify.app](https://tc-spa-boilerplate.netlify.app)

## Features

- Search for a location
- View nearby restaurants, including loading more after scrolling to the bottom
- View details about a restaurant

- Main tech stack: React, TypeScript, Emotion, i18n
- Tablekit integration with FontAwesome icons and Dark Mode
- Basic localized routing
- Basic layout with footer, top and side navs
- Language Selection
- Responsive
- Basic FormSpree contact form

## Getting started

- Install [Node.js](https://nodejs.org/en/download/) and [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Fork/Clone this project
- Run `nvm use` or `nvm use <version>` (on machines running Windows)
- Run `npm i --legacy-peer-deps` (will install the dependencies)
- Run `npm start` (will start the app in http://localhost:3000/)

## Digging into the code

### Machines

Most of the state management is handled by [xState](https://xstate.js.org). Any asynchronous operations should be handled within the context of a state machine. All machines are built assuming they will receive well-typed but not necessarily otherwise valid events. Machines should be thoroughly tested, as they are responsible for workflow logic that might be easy to miss corner cases for.

### Components

Components that are responsible for only display logic are located in the Components directory. They can be mostly tested using snapshots.

### Pages

Pages have more complex functionality including state management.

## Running tests

Tests can be run via `npm test`. This includes unit tests and snapshot tests.

## Future work

- Currently the app doesn't unrender previously-loaded restaurants. This could get expensive memory-wise after enough additional loads. In the ideal case, we would start to remove from both the DOM and the app's memory as we load in more restaurants.
- As a related nice-to-have, a "Return to top" button or otherwise easy way to access the search after scrolling for a while.
- Addresses always seemed to be in Japanese without any localization; lacking cues, I made no attempt to have the app switch smartly.
- I only added localization for English and (basic) Japanese for the new text fields I added; other supported languages should be filled out as well (and the Japanese should be fixed by someone with more fluency than me).
- The app could use TLC from a designer overall; in particular the panel is rather bland.

## Deploy to production

The boilerplate is configured to be deployed to [Netlify](https://netlify.com), but it can also work with Github pages,
Vercel, AWS Amplify, etc.

Instructions for a Netlify setup:

- Click on `New site from Git`
- Select `Github` and the repository where you forked it
- Change Publish directory to `build/public`
- Change the Build command to `CI= npm run build`
- Deploy site
- You can change the URL name on `Site settings > Change site name`

## Caveats

- At some point, if the project becomes a real product, all the files in `/public/static/img` and `/public/static/fonts`
  should be removed and loaded from a CDN
- The CDN URL should be specified in `/config/default.json`

## Upgrade

To upgrade this boilerplate and use the latest configuration and dependencies, please run this command and select SPA
when asked:

`npx --legacy-peer-deps -p @tablecheck/scripts tablecheck-scripts init`

## Support

Create an issue in the Github repository

## Resources

- [i18n Manager](https://www.electronjs.org/apps/i18n-manager): helpful editor for the translations

## Contributing

Pull requests for bug fixes and suggestions are welcome. Please **do not raise a PR for take-home assignments**. For
major changes, please open an issue first to discuss what you
would like to change. Please make sure to update tests as appropriate.

## About Us

SPA Boilerplate is made with ❤️ by [TableCheck](https://www.tablecheck.com/en/join/),
the leading restaurant reservation and guest management app maker. If **you** are a
ninja-level 🥷 coder (Javascript / Ruby / Elixir / Python / Go), designer, product manager,
data scientist, QA, etc. and are ready to join us in Tokyo, Japan or work remotely,
please get in touch at [careers@tablecheck.com](mailto:careers@tablecheck.com)
or [careers.tablecheck.com](https://careers.tablecheck.com).

## License

SPA Boilerplate is licensed under the MIT license.

## Copyright

Copyright (c) 2022 TableCheck Inc.

Text Fonts from [IBM](https://github.com/IBM/plex/releases/)
