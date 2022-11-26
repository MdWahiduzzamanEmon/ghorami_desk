import React from 'react';
import './Messenger.css';
import MessageList from './../MessageList/index';
import { Box } from '@mui/material';

export default function Messenger({ trackerId }) {
  return (
    <div className="messenger">
      <Box className="content">
        <MessageList trackerId={trackerId} />
      </Box>
    </div>
  );
}