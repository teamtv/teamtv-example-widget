import React, { Fragment } from 'react';
import { StatsProvider, StatsConsumer } from '@teamtv/eventstream-client-react';

import styles from './Widget.css';

const formatTime = function (sec) {
  const sec_num = parseInt(sec, 10); // don't forget the second param
//        let hours   = Math.floor(sec_num / 3600);
  const hours = 0;
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

//        if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return minutes+':'+seconds;
};

const Score = () => {
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

const PeriodLog = ({label, state, goals}) => {
  return (
    <Fragment>
      <div>Start period {label}</div>
      {goals.map(({id, score, time: {time}, person, team}) => {
        const personName = person ? `${person.firstName} ${person.lastName}` : 'unknown';
        return <div key={id} className={styles.row}>{score.home} - {score.away} {formatTime(time)} {personName} {team.name}</div>
      })}
      {(state === "ENDED") && <div>End period {label}</div>}
    </Fragment>
  );
};

const MatchLog = () => {
  return (
    <StatsConsumer types={["period", "goals"]}>
      {({match, period, goals}) => {
        if (!match) {
          return <div>loading...</div>;
        }
        return (
          <div>
            {(period.period1 !== "NOT-STARTED") && <PeriodLog label='1' state={period.period1} goals={goals.filter(({time: {period}}) => period == '1')} />}
            {(period.period2 !== "NOT-STARTED") && <PeriodLog label='2' state={period.period2} goals={goals.filter(({time: {period}}) => period == '2')} />}
          </div>
        )
      }
      }
    </StatsConsumer>
  );
};

const Widget = ({endpointUrl}) => (
  <StatsProvider endpointUrl={endpointUrl}>
    <Score />
    <MatchLog/>
  </StatsProvider>
);

export {Widget};
