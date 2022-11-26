import {
  Paper,
  Box,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RiAddBoxLine } from "react-icons/ri";
import AdminAddModal from "./AdminAddModal/AdminAddModal";
import swal from "sweetalert";

const Admin = ({ trackerId, admin, twoCompApiLoad, setTwoCompApiLoad }) => {
  const [assignerList, setAssignerList] = React.useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [loader, setLoader] = React.useState(true);
  const [pageRefresh, setPageRefresh] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //   console.log(location.state);

  useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state.room);
    formData.append("task", trackerId);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/api/utask_tag_all.php
`,
        formData
      )
      .then((res) => {
        // console.log(res.data);

        setAssignerList(res.data);
        setLoader(false);
      });
  }, [
    user.master_url,
    trackerId,
    location.state.room,
    user.sopnoid,
    pageRefresh,
    twoCompApiLoad,
  ]);
  const handleMoveMakeAssigner = (titlec) => {
    const formData = new FormData();
    formData.append("poster", user.sopnoid);
    formData.append("room_id", location.state.room);
    formData.append("maintas", trackerId);
    formData.append("titlec", titlec);
    formData.append("ser_refer", location.state.serviceID);
    axios
      .post(
        `${user.master_url}/profile/task_tag_forward.php
`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        if (res.data === "success") {
          swal("Successfully add to assigner", "Successfully", "success");
          setPageRefresh(!pageRefresh);
          setTwoCompApiLoad(!twoCompApiLoad);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Paper
        sx={[
          {
            // ml: 2,
            width: "230px",
            mx: "auto",
            "@media only screen and (max-width: 1024px)": {
              width: "100%",
            },
            "@media screen and (max-width: 768px)": {
              mb: 1,
            },
          },
        ]}
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
          <h5>Admin</h5>
          {admin && (
            <Button
              sx={{
                color: "#ff0000",
                fontSize: "20px",
                border: "1px solid #ff0000",
              }}
              onClick={handleOpen}
            >
              <RiAddBoxLine />
            </Button>
          )}
          <AdminAddModal
            open={open}
            handleClose={handleClose}
            trackerId={trackerId}
            setPageRefresh={setPageRefresh}
            pageRefresh={pageRefresh}
          />
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
              height: assignerList?.length > 2 ? "150px" : "auto",
            }}
          >
            {assignerList?.map((assigner, i) => (
              <>
                {admin && (
                  <div className="dropdown" key={i}>
                    <p
                      className="dropdown-toggle"
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                        fontSize: ".9rem",
                      }}
                      type="button"
                      id="dropdownMenu2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {assigner?.as_name}
                    </p>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenu2"
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            handleMoveMakeAssigner(assigner?.as_gid);
                            // console.log(assigner?.as_name);
                          }}
                        >
                          Move to assign
                        </button>
                      </li>
                      {/* <li>
                      <button className="dropdown-item" type="button">
                        Delete
                      </button>
                    </li> */}
                    </ul>
                  </div>
                )}
                {!admin && (
                  <p
                    key={i}
                    style={{
                      backgroundColor: "#f5f5f5",
                      fontSize: ".9rem",
                    }}
                  >
                    {assigner?.as_name}
                  </p>
                )}
              </>
            ))}
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default React.memo(Admin);
