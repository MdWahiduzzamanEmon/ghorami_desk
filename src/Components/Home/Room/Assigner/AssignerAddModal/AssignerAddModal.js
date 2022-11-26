import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const AssignerAddModal = ({
  handleClose,
  open,
  trackerId,
  setPageRefresh,
  pageRefresh,
}) => {
  const [assignerName, setAssignerName] = React.useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  // console.log(location, trackerId, assignerName);
  const handleAddAssigner = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("titlec", assignerName);
    formData.append("poster", user.sopnoid);
    formData.append("ser_refer", location.state.serviceID);
    formData.append("room_id", location.state.room);
    formData.append("maintas", trackerId);

    axios
      .post(`${user.master_url}/profile/task_assignNew.php`, formData)
      .then((res) => {
        // console.log(res.data);
        if (res?.data === "success") {
          handleClose();
          swal({
            title: "Success",
            text: "Assigner Added",
            icon: "success",
            button: true,
          });
          setPageRefresh(!pageRefresh);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
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
          <Typography
            id="transition-modal-title"
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            Add New Assigner
          </Typography>
          <form onSubmit={handleAddAssigner}>
            <TextField
              id="standard-basic"
              label="Email/Phone"
              margin="normal"
              fullWidth
              onChange={(e) => setAssignerName(e.target.value)}
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
  );
};

export default AssignerAddModal;
