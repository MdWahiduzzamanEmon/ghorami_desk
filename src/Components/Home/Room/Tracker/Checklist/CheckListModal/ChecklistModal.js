import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ChecklistModal = ({
  open,
  handleClose,
  trackerId,
  pageRefresh,
  setPageRefresh,
}) => {
  const [checklistTitle, setChecklistTitle] = useState("");
  const [note, setNote] = React.useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  // console.log(location);
  // console.log(trackerId, location.state.serviceID);
  const handleAddCheckList = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("titlec", checklistTitle);
    formData.append("poster", user.sopnoid);
    formData.append("ser_refer", location.state.serviceID);
    formData.append("room_id", location.state.room);
    formData.append("maintas", trackerId);
    formData.append("notec", note);

    axios
      .post(`${user.master_url}/profile/task_checkNew.php`, formData)
      .then((res) => {
        if (res?.data === "success") {
          setPageRefresh(!pageRefresh);
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <h6 id="transition-modal-title" style={{
              fontWeight: "bold",
              textAlign:'center',
              marginBottom: '1rem'
            }}>Add New Checklist</h6>
            <form onSubmit={handleAddCheckList}>
              <TextField
                id="standard-basic"
                label="Title"
                fullWidth
                onChange={(e) => setChecklistTitle(e.target.value)}
                color="warning"
              />
              <TextField
                id="standard-basic"
                label="Note"
                fullWidth
                margin="normal"
                onChange={(e) => setNote(e.target.value)}
                color="warning"
              />

              <Button
                variant="contained"
                color="success"
                size="small"
                style={{
                  marginTop: "1rem",
                  width: "100%",
                }}
                type="submit"
              >
                Save
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
export default ChecklistModal;
