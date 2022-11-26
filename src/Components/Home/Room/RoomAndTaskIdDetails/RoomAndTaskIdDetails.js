import React from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const RoomAndTaskIdDetails = ({ trackerId }) => {
  const location = useLocation();
  const { room } = location.state;
  return (
    <Box sx={{
      p:2
    }}>
      <Box
        sx={{
          fontWeight: "bold",
        }}
      >
        Room Id:{" "}
        <span
          style={{
            color: "#7F7F7F",
            fontSize: ".9rem",
          }}
        >
          {room}
        </span>{" "}
      </Box>
      <Box
        sx={{
          fontWeight: "bold",
        }}
      >
        Tracker Id:{" "}
        <span
          style={{
            color: "#7F7F7F",
            fontSize: ".9rem",
          }}
        >
          {trackerId}
        </span>
      </Box>
    </Box>
  );
};

export default RoomAndTaskIdDetails;
