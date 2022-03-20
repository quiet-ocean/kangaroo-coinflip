import React from 'react';
import { Row, Col, Stack, Image } from 'react-bootstrap';
import RealtimeIcon from '../assets/realtime.png';

import '../styles/recent_flips.scss'
const recentFlips = [
  'hunnaharms.near flipped 0.25 Ⓝ and doubled',
  'x4232333444232ss.near flipped 0.3 Ⓝ and has doubled',

]
const RecentFlips = () => {
  return (
    <Row>
      <Col md={8} className="recent_flips">
        <h2 className="bold-font">Recent Flips</h2>
        <Stack gap={3}>
          {
            recentFlips.map((item, key)=>{  
              return (
                <Stack direction="horizontal" gap={2} key={key}>
                  <Image src={RealtimeIcon} />
                  <p>{item}</p>
                  <p>1 m</p>
                </Stack>
              )
            })
          }
        </Stack>
      </Col>
    </Row>
  );
};

export default RecentFlips;