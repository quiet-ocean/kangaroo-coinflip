import React from 'react';
import { Row, Col, Stack, Image } from 'react-bootstrap';
import RealtimeIcon from '../assets/realtime.png';

import '../styles/recent_flips.scss'
const recentFlips = [
  'hunnaharms.near flipped 0.25 Ⓝ and doubled',
  'x4232333444232ss.near flipped 0.3 Ⓝ and has doubled',

]
const RecentFlips = (props) => {

  const { history } = props;

  const getTime = (time) => {

    let currentTime = new Date().getTime();
    let min = parseInt((currentTime - time) / 60);
    let hour = 0;

    if (min >= 60) {
      hour = parseInt(min / 60);
      min = min % 60;
    }
    return (hour > 0) ? hour + ' h ' + min + ' m' : min + ' m';
  }

  return (
    <Col md={8} className="recent_flips">
      <h2 className="bold-font">Recent Flips</h2>
      <Stack gap={3} className="px-0 px-md-4">
        {
          history.map((item, key) => {
            return (
              <Stack direction="horizontal" className="recent_flips_item" gap={2} key={key}>
                <Image src={RealtimeIcon} />
                <p>{item.signer_id + ` flipped ` + item.amount + ' Ⓝ and ' + item.result.toLowerCase()}</p>
                <p>{getTime(item.timestamp)}</p>
              </Stack>
            )
          })
        }
      </Stack>
    </Col>
  );
};

export default RecentFlips;