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

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const groupCount = (xs, key) => {
  const groups = groupBy(xs, key);
  for(const key of Object.keys(groups)) {
    groups[key] = groups[key].length;
  }
  return groups;
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

const GoalTypeStats = () => {
  return (
    <StatsConsumer types={["goals"]}>
    {({match, goals}) => {
      if (!match) {
        return <div>loading...</div>;
      }
      const homeGoals = goals.filter(({teamId}) => teamId === match.homeTeam.teamId);
      const awayGoals = goals.filter(({teamId}) => teamId === match.awayTeam.teamId);

      const homeGoalsPerType = groupCount(homeGoals, 'type');
      const awayGoalsPerType = groupCount(awayGoals, 'type');


      return (
        <div id="table1">
          <div className="row header-row">
            <div className="cell">{match.homeTeam.name}</div>
            <div className="cell" />
            <div className="cell">{match.awayTeam.name}</div>
          </div>
          <div className="row">
            <div className="cell">{homeGoals.length}</div>
            <div className="cell">Total</div>
            <div className="cell">{awayGoals.length}</div>
          </div>
          <div className="row">
            <div className="cell">{homeGoalsPerType['LONG'] || 0}</div>
            <div className="cell">Long Shot</div>
            <div className="cell">{awayGoalsPerType['LONG'] || 0}</div>
          </div>
          <div className="row">
            <div className="cell">{homeGoalsPerType['SHORT'] || 0}</div>
            <div className="cell">Short Shot</div>
            <div className="cell">{awayGoalsPerType['SHORT'] || 0}</div>
          </div>
          <div className="row">
            <div className="cell">{homeGoalsPerType['RUNNING-IN'] || 0}</div>
            <div className="cell">Running In</div>
            <div className="cell">{awayGoalsPerType['RUNNING-IN'] || 0}</div>
          </div>
          <div className="row">
            <div className="cell">{homeGoalsPerType['FREE-BALL'] || 0}</div>
            <div className="cell">Free Pass</div>
            <div className="cell">{awayGoalsPerType['FREE-BALL'] || 0}</div>
          </div>
          <div className="row">
            <div className="cell">{homeGoalsPerType['PENALTY'] || 0}</div>
            <div className="cell">Penalty</div>
            <div className="cell">{awayGoalsPerType['PENALTY'] || 0}</div>
          </div>
          <div className="row">
            <div className="cell">{homeGoalsPerType['undefined'] || 0}</div>
            <div className="cell">Other</div>
            <div className="cell">{awayGoalsPerType['undefined'] || 0}</div>
          </div>
        </div>
      )

    }}
    </StatsConsumer>
  );
};

const TeamPlayerStats = ({goals, label}) => {
  const goalsPerPerson = groupBy(goals, 'personId');
  const entries = Object.entries(goalsPerPerson);
  entries.sort((a, b) => b[1].length - a[1].length);
  return (
    <Fragment>
      <span className="hometeam">{label}:</span>
      <div id="table">
        <div className="row">
          <div className="cell">Name</div>
          <div className="cell">Score</div>
        </div>
      {entries.map(([personId, goals]) => {
        let name = <i>unknown</i>;
        if (!!goals[0].person) {
          name = `${goals[0].person.firstName} ${goals[0].person.lastName}`;
        }
        return (
          <div className="row">
            <div className="cell">{name}</div>
            <div className="cell">{goals.length}</div>
          </div>
        );
      })}
      </div>
    </Fragment>
  )
};

const PlayerStats = () => {
  return (
    <StatsConsumer types={["goals"]}>
      {({match, goals}) => {
        if (!match) {
          return <div>loading...</div>;
        }
        return (
          <Fragment>
            <TeamPlayerStats goals={goals.filter(({teamId}) => teamId === match.homeTeam.teamId)} label={match.homeTeam.name} />
            <TeamPlayerStats goals={goals.filter(({teamId}) => teamId === match.awayTeam.teamId)} label={match.awayTeam.name} />
          </Fragment>
        )
      }
      }
    </StatsConsumer>
  );
};

const PeriodLog = ({label, state, goals}) => {
  return (
    <Fragment>
      <div className="row">
        <div className="cell" />
        <div className="cell">00:00</div>
        <div className="cell">Start Clock</div>
        <div className="cell">-</div>
        <div className="cell" />
        <div className="cell" />
      </div>
      {goals.map(({id, score, type, time: {time}, person, team}) => {
        const personName = person ? `${person.firstName} ${person.lastName}` : <i>unknown</i>;
        return (
          <div key={id} className="row">
            <div className="cell">{score.home} - {score.away}</div>
            <div className="cell">{formatTime(time)}</div>
            <div className="cell">{type || <i>unknown</i>}</div>
            <div className="cell">{personName}</div>
            <div className="cell">{team.name}</div>
          </div>
        );
      })}
      {(state === "ENDED") && (
        <div className="row">
          <div className="cell" />
          <div className="cell" />
          <div className="cell">End Clock</div>
          <div className="cell">-</div>
          <div className="cell" />
          <div className="cell" />
        </div>
      )}
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
          <Fragment>
            <span className="log">Log:</span>
            <div id="table">
              {(period.period1 !== "NOT-STARTED") && <PeriodLog label='1' state={period.period1} goals={goals.filter(({time: {period}}) => period == '1')} />}
              {(period.period2 !== "NOT-STARTED") && <PeriodLog label='2' state={period.period2} goals={goals.filter(({time: {period}}) => period == '2')} />}
            </div>
          </Fragment>
        )
      }
      }
    </StatsConsumer>
  );
};

const Widget = ({endpointUrl}) => (
  <StatsProvider endpointUrl={endpointUrl}>
    <GoalTypeStats />
    <PlayerStats />
    {/*<Score />*/}
    <MatchLog/>
  </StatsProvider>
);

export {Widget};
