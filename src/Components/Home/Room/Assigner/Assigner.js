import { Paper, Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RiAddBoxLine } from "react-icons/ri";
import AssignerAddModal from "./AssignerAddModal/AssignerAddModal";
import swal from "sweetalert";

const Assigner = ({ trackerId, admin, twoCompApiLoad, setTwoCompApiLoad }) => {
  const [assignerList, setAssignerList] = React.useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loader, setLoader] = React.useState(true);
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [pageRefresh, setPageRefresh] = React.useState(false);

  // console.log(location.state);
  useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state.room);
    formData.append("task", trackerId);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/api/utask_assign_all.php
`,
        formData
      )
      .then((res) => {
      
        // remove duplicate 
        const unique = res.data.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.as_gid === thing.as_gid &&  
                t.as_name === thing.as_name
            )
        );
        
        setAssignerList(unique);

        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    user.master_url,
    trackerId,
    location.state.room,
    user.sopnoid,
    pageRefresh,
    twoCompApiLoad,
  ]);

  const handleMoveMakeAdmin = (titlec) => {
    const formData = new FormData();
    formData.append("poster", user.sopnoid);
    formData.append("room_id", location.state.room);
    formData.append("maintas", trackerId);
    formData.append("titlec", titlec);
    formData.append("ser_refer", location.state.serviceID);
    axios
      .post(
        `${user.master_url}/profile/task_assign_foreward.php
`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        if (res.data === "success") {
          swal("Successfully add to admin", "Successfully", "success");
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
          <h5>Assigner</h5>
          {/* //admin permission */}
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
          <AssignerAddModal
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
                      // type="button"
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
                            // console.log(assigner?.as_name);
                            handleMoveMakeAdmin(assigner?.as_gid);
                          }}
                        >
                          Move to Admin
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

export default React.memo(Assigner);
