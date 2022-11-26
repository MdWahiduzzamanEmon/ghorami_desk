import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { TextField } from "@mui/material";
import useAuth from "../../../../../../Hooks/useAuth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 4,
  p: 4,
};

const CheckListStatusChngModal = ({
  open1,
  handleClose1,
  data,
  checked,
  setReload,
  reload,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [note, setNote] = React.useState("");
  const { pageRefresh, setPageRefresh } = useAuth();

  const handleCheckLstChngSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("SopnoID", user?.sopnoid);
    formData.append("servi", location.state?.serviceID);
    formData.append("pref", data?.task);
    formData.append("id", data?.ch_id);
    formData.append("typ", checked ? "2" : "1");
    formData.append("note", note);
    formData.append("action", "fetch");
    axios
      .post(
        `${user?.master_url}/profile/login/api/utask_check_st_sn.php`,
        formData
      )
      .then((res) => {
        // console.log(res);
        // handleClose();
        console.log(res.data[0]?.message);
        if (res.data[0]?.message === "Success") {
          setReload(!reload);
          setPageRefresh(!pageRefresh);
          handleClose1();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open1}
        onClose={handleClose1}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open1}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {data?.ch_details}
            </Typography>
            <Typography
              id="transition-modal-title"
              variant="subtitle2"
              component="div"
              sx={{
                color: "text.secondary",
              }}
            >
              {checked
                ? "Are you sure you want to mark this task as completed?"
                : "Are you sure you want to mark this task as reset?"}
            </Typography>
            <form onSubmit={handleCheckLstChngSubmit}>
              <TextField
                id="standard-basic"
                label="Note"
                fullWidth
                margin="normal"
                onChange={(e) => setNote?.(e.target?.value)}
                color="warning"
              />

              <Button
                variant="contained"
                color="success"
                size="small"
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "1rem",
                }}
                type="submit"
              >
                {checked ? "Mark as Completed" : "Mark as Reset"}
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default CheckListStatusChngModal;
