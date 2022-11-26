/* eslint-disable no-unused-expressions */
import { Paper, Box, Avatar, Typography } from "@mui/material";
import React from "react";
import axios from "axios";

const TeamMembers = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [teamMembers, setTeamMembers] = React.useState([]);

  React.useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_member_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setTeamMembers(res?.data);
      });
  }, [user?.master_url, user?.sopnoid]);
  //   console.log(teamMembers);
  return (
    <Box
      sx={{
        overflowY: teamMembers.length > 5 ? "scroll" : "auto",
        height:window.innerHeight>=500?"calc(100vh - 360px)":"calc(100vh - 100px)",
      }}
    >
      {teamMembers?.map((member,i) => {
        return (
          <Paper
            key={i}
            variant="outlined"
            sx={{
              p: 1,
              display: "flex",
              my: 1,
            }}
          >
            <Box>
              <Avatar
                alt="Remy Sharp"
                src={member?.as_pic}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.open(
                    `https://ghorami.com/profile/public/profile.php?pref=${member?.as_userid}`,
                    "_blank"
                  );
                  // console.log(member?.as_userid);?
                }}
              >
                {member?.as_name}
              </Typography>
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                sx={{
                  color: "#9E9E9E",
                }}
              >
                Member Since: {member?.ch_time}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default TeamMembers;
