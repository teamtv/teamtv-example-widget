# TeamTV widget example

_Simple Example how to build a widget for on your website which includes data from the teamtv EventStream_

## Building

```bash
npm run-script build
```
This will create `dist/widget.js`

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { StatsProvider, StatsConsumer } from '@teamtv/eventstream-client-react';

const ScoreWidget = ({match, score}) => {
  return (
    <StatsConsumer types={["score"]}>
      {({match, score}) => {
        if (!match) {
          return <div>loading...</div>;
        }
        return (
          <div>
            <div>{match.homeTeam.name} - {match.awayTeam.name}</div>
            <div>{score.home} - {score.away}</div>
          </div>
        )
      }
      }
    </StatsConsumer>
  );
};

ReactDOM.render(
  <StatsProvider endpointUrl="<teamtv eventstream endpoint>">
    <ScoreWidget />
  </StatsProvider>,
  document.getElementById("app")
);


```
