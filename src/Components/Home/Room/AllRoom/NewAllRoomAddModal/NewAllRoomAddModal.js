import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import swal from "sweetalert";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "4px",
  boxShadow: 24,
  p: 4,
};

export default function NewAllRoomAddModal({ handleClose, open }) {
  const [selectColor, setSelectColor] = React.useState("");
  const [selectCategory, setSelectCategory] = React.useState("");
  const [subCategory, setSubCategory] = React.useState("");
  const [ghoramiId, setGhoramiId] = React.useState("");
  const [roomTitle, setRoomTitle] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [jobInfo, setJobInfo] = React.useState("");
  const [schedule, setSchedule] = React.useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  //get category data
  const [categoryData, setCategoryData] = React.useState([]);
  React.useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    axios
      .post(
        `${user.master_url}/profile/login/api/ap_get_category.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setCategoryData(res.data);
      });
  }, [user.master_url, user.sopnoid]);

  //get subcategory data
  const [subCategoryData, setSubCategoryData] = React.useState([]);
  React.useEffect(() => {
    const formData = new FormData();
    formData.append("action", "fetch");
    if (selectCategory.length === 0) {
      formData.append("pref", "1");
    } else {
      formData.append("pref", selectCategory);
    }
    axios
      .post(`${user.master_url}/profile/login/api/ap_get_subcat.php`, formData)
      .then((res) => {
        // console.log(res.data);
        setSubCategoryData(res.data);
      });
  }, [user.master_url, selectCategory]);

  //save room
  const handleAddNewRoom = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("about", jobInfo);
    formData.append("categoty", selectCategory);
    formData.append("subcategory", subCategory);
    formData.append("title", roomTitle);
    formData.append("Cost", budget);
    formData.append("Schedule", schedule);
    formData.append("postk", user.sopnoid);
    formData.append("aemail", ghoramiId);
    formData.append("color", selectColor);
    formData.append("position", position);

    axios
      .post(`${user.master_url}/profile/login/api/uroom_new.php`, formData)
      .then((res) => {
        // console.log(res.data);
        if (res.data[0].message) {
          swal("New Room Added", "", "success");
          handleClose();
        }
      });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              textAlign: "center",
              mb: 2,
              borderBottom: "1px solid #ccc",
            }}
          >
            Add New Room
          </Typography>
          <form onSubmit={handleAddNewRoom}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth color="warning" required>
                  <InputLabel id="demo-simple-select-label">
                    Select Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //   value={age}
                    value={selectCategory}
                    label="Select Category"
                    onChange={(e) => setSelectCategory(e.target.value)}
                  >
                    {categoryData.map((item) => (
                      <MenuItem key={item.cat_id} value={item.cat_id}>
                        {item.cat_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth color="warning" required>
                  <InputLabel id="demo-simple-select-label">
                    Sub Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //   value={age}
                    value={subCategory}
                    label="Sub Category"
                    //   onChange={handleChange}
                    onChange={(e) => setSubCategory(e.target.value)}
                  >
                    {subCategoryData.map((item) => (
                      <MenuItem key={item?.sub_sq} value={item?.sub_id}>
                        {item?.sub_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="outlined-basic1"
                  label="Freelancer/Agency [Email/Ghorami ID,Mobile Number]"
                  variant="outlined"
                  fullWidth
                  color="warning"
                  required
                  onChange={(e) => setGhoramiId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="outlined-basic2"
                  label="Room Title"
                  variant="outlined"
                  fullWidth
                  color="warning"
                  required
                  onChange={(e) => setRoomTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth color="warning" required>
                  <InputLabel id="demo-simple-select-label">
                    Timeline for room
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //   value={age}
                    value={schedule}
                    label="Timeline for room"
                    //   onChange={handleChange}
                    onChange={(e) => setSchedule(e.target.value)}
                  >
                    <MenuItem value={1}>Less than 1 month</MenuItem>
                    <MenuItem value={2}>1 to 3 Month</MenuItem>
                    <MenuItem value={3}>3 to 6 Month</MenuItem>
                    <MenuItem value={4}>More than 6 Month</MenuItem>
                    <MenuItem value={5}>Less than 7 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="outlined-basic3"
                  label="Estimate Cost/Budget (Minimum 100)"
                  variant="outlined"
                  fullWidth
                  color="warning"
                  required
                  onChange={(e) => setBudget(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth color="warning" required>
                  <InputLabel id="demo-simple-select-label">
                    Position
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //   value={age}
                    value={position}
                    label="Position"
                    //   onChange={handleChange}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <MenuItem value={0}>Low</MenuItem>
                    <MenuItem value={1}>Medium</MenuItem>
                    <MenuItem value={2}>Top</MenuItem>
                    <MenuItem value={3}>High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  id="outlined-basic3"
                  label="Job Info"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  color="warning"
                  required
                  onChange={(e) => setJobInfo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#B4B4B4",
                  }}
                >
                  {" "}
                  Color -
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#f44336",
                      borderRadius: "50%",
                      cursor: "pointer",
                      mr: 2,
                      border:
                        selectColor === "#f44336" ? "2px solid #000" : "none",
                    }}
                    onClick={() => setSelectColor("#f44336")}
                  />
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#ff9800",
                      borderRadius: "50%",
                      border:
                        selectColor === "#ff9800" ? "2px solid #000" : "none",
                      cursor: "pointer",
                      mr: 2,
                    }}
                    onClick={() => setSelectColor("#ff9800")}
                  />
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#ffeb3b",
                      borderRadius: "50%",
                      border:
                        selectColor === "#ffeb3b" ? "2px solid #000" : "none",
                      cursor: "pointer",
                      mr: 2,
                    }}
                    onClick={() => setSelectColor("#ffeb3b")}
                  />
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#4caf50",
                      borderRadius: "50%",
                      border:
                        selectColor === "#4caf50" ? "2px solid #000" : "none",
                      cursor: "pointer",
                      mr: 2,
                    }}
                    onClick={() => setSelectColor("#4caf50")}
                  />
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#2196f3",
                      borderRadius: "50%",
                      border:
                        selectColor === "#2196f3" ? "2px solid #000" : "none",
                      cursor: "pointer",
                      mr: 2,
                    }}
                    onClick={() => setSelectColor("#2196f3")}
                  />
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#9c27b0",
                      borderRadius: "50%",
                      border:
                        selectColor === "#9c27b0" ? "2px solid #000" : "none",
                      cursor: "pointer",
                      mr: 2,
                    }}
                    onClick={() => setSelectColor("#9c27b0")}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                my: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  mr: 2,
                }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                type="reset"
                // onClick={handleClose}
              >
                Reset
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
