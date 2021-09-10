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

const MatchRowInner = ({homeTeam, awayTeam, children}) => {
  return (
    <div className={styles.matchRow}>
      <div className={styles.teamName}>
        {homeTeam}
      </div>
      <div className={styles.center}>
        {children}
      </div>
      <div className={styles.teamName}>
        {awayTeam}
      </div>
    </div>
  )
};

const FullTimeContent = ({homeScore, awayScore}) => (
  <div className={styles.scoreBar}>
    <div>{homeScore}</div>
    <div className={styles.fullTime}>
      VOLLZEIT
    </div>
    <div>{awayScore}</div>
  </div>
);

const InProgressContent = ({homeScore, awayScore, period}) => (
  <div className={styles.scoreBar}>
    <div>{homeScore}</div>
    <div>
      <div className={styles.periodTitle}>{period.periodId}st zeitraum</div>
      <div className={styles.time}>'{parseInt(period.time / 60)}</div>
    </div>
    <div>{awayScore}</div>
  </div>
);


const MatchRow = ({endpointUrl}) => {
  return (
    <StatsProvider endpointUrl={endpointUrl} options={{periodCount: 4, refreshInterval: 30}}>
      <StatsConsumer types={["score", "period"]}>
        {({match, period, score}) => {
          if (!match) {
            return null;
          }
          let content = null;

          switch (true)
          {
            case period.period1.state === "NOT-STARTED":
              const scheduledAt = new Date(match.scheduledAt);
              content = (
                <div className={styles.upcomingTime}>
                  {formatTime(scheduledAt.getHours() * 60 + scheduledAt.getMinutes())}
                </div>
              );
              break;
            case period.period4.state === "ENDED":
              content = (
                <FullTimeContent homeScore={score.home} awayScore={score.away} />
              );
              break;

            default:
              let currentPeriod;
              for(const periodId of [1, 2, 3, 4])
              {
                if (period[`period${periodId}`].state !== "ENDED") {
                  currentPeriod = {periodId, ...period[`period${periodId}`]};
                  break;
                }
              }
              content = (
                <InProgressContent homeScore={score.home} awayScore={score.away} period={currentPeriod} />
              );
          }

          return (
            <MatchRowInner homeTeam={match.homeTeam.name} awayTeam={match.awayTeam.name}>
              {content}
            </MatchRowInner>
          )
        }}
      </StatsConsumer>
    </StatsProvider>
  );
};

const Widget = ({title, subtitle, endpointUrls}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>{title}</div>
        <div>{subtitle}</div>
      </div>
      {endpointUrls.map((endpointUrl) => (
       <MatchRow endpointUrl={endpointUrl} key={endpointUrl} />
      ))}
    </div>
  );
};

export {Widget};
