import React from "react";
import { Divider, Button, Paper, Box } from "@mui/material";
const ViewDetailsSetting = () => {
  return (
    <div>
      <Paper
        sx={{
          textAlign: "center",
          p: 2,
          mt: 2,
        }}
        variant="outlined"
      >
        <Box></Box>
        <h6
          style={{
            fontWeight: "bold",
          }}
        >
          {/* Notifications */}
          Invitation
        </h6>
        <small
          style={{
            color: "#7F7F7F",
          }}
        >
          You’re all caught up! Check back later for new notifications
        </small>
        <Divider
          sx={{
            mt: 2,
          }}
        />
        <Button
          variant="outlined"
          size="sm"
          sx={{
            mt: 1,
          }}
        >
          View Setting
        </Button>
      </Paper>
    </div>
  );
};

export default ViewDetailsSetting;
