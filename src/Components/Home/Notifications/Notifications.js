import { Box, Grid } from "@mui/material";
import React, { useEffect } from "react";
import useAuth from "../../../Hooks/useAuth";
import NotificationList from "./NotificationList/NotificationList";
import ViewDetailsSetting from "./VIewDetailsSetting/ViewDetailsSetting";

const Notifications = () => {
  useEffect(() => {
    document.title = "Ghorami Desk - Notifications";
  }, []);
  const { notificationData } = useAuth();
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <ViewDetailsSetting />
        </Grid>
        <Grid item xs={12} md={8}>
          <NotificationList notificationData={notificationData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Notifications;
