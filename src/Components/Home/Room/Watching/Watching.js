import { Paper, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Watching = ({ trackerId }) => {
  const [assignerList, setAssignerList] = React.useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loader, setLoader] = React.useState(true);
  const location = useLocation();
  //   console.log(location.state);
  useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state.room);
    formData.append("task", trackerId);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/api/utask_watching_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setAssignerList(res.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.master_url, trackerId, location.state.room, user.sopnoid]);
  return (
    <div>
      <Paper
        sx={{
          // ml: 2,
          width: "230px",
          mx: "auto",
          "@media only screen and (max-width: 1024px)": {
            width: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: "10px",
            mt: "10px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <h5>Watching</h5>
        </Box>
        {loader ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: "10px",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Box
            sx={{
              p: "10px",
              overflowY: assignerList?.length > 3 ? "scroll" : "auto",
              height: assignerList?.length > 2 ? "120px" : "auto",
            }}
          >
            {assignerList?.map((assigner, i) => (
              // <List key={i}>
              <p
                key={i}
                style={{
                  backgroundColor: "#f5f5f5",
                  fontSize: ".9rem",
                }}
              >
                {assigner?.as_name}
              </p>
              // </List>
            ))}
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default React.memo(Watching);
