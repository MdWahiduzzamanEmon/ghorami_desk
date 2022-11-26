import React, { useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid, TextField, Button } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/lab";
import Time from "./Time";
import MainCard from "./../../Shared/MainCard/MainCard";
import Session from "./Session";
import { BiArrowBack } from "react-icons/bi";


const TimeSheet = () => {
  useEffect(() => {
    document.title = "Ghorami Desk - TimeSheet";
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const [assignerList, setAssignerList] = React.useState([]);
  const [adminList, setAdminList] = React.useState([]);
  const location = useLocation();
  const [value, setValue] = React.useState(new Date());
  const [assignerData, setAssignerData] = React.useState([]);
  const [componentChng, setComponentChng] = React.useState(false);
  const [selectedSessionOrScreenShot, setSelectedSessionOrScreenShot] =
    React.useState("ScreenShot");
  const day = value.getDate();
  const month = value.getMonth() + 1;
  const year = value.getFullYear();

  useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state?.room);
    formData.append("task", location.state?.taskID);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/api/utask_assign_all.php
    `,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setAssignerList(res.data);
        // setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    user.master_url,
    location.state.room,
    user.sopnoid,
    location.state.taskID,
  ]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state.room);
    formData.append("task", location.state.taskID);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/api/utask_tag_all.php
    `,
        formData
      )
      .then((res) => {
        // console.log(res.data);

        setAdminList(res.data);
        //  setLoader(false);
      });
  }, [
    user.master_url,
    location.state.room,
    user.sopnoid,
    location.state.taskID,
  ]);
  const adminAndAssigner = [...adminList, ...assignerList];

  const check = adminAndAssigner.find((item) => item?.as_gid === user.sopnoid);

  const [selectedAssigner, setSelectedAssigner] = React.useState("");

  useEffect(() => {
    // assignerTimeCall();
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state.room);
    formData.append("task", location.state.taskID);
    formData.append("assign_id", selectedAssigner);
    formData.append("day", day);
    formData.append("month", month);
    formData.append("year", year);
    formData.append("condition", "1");
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_timesheet.php
  `,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setAssignerData?.(res.data);
      });
  }, [
    selectedAssigner,
    day,
    month,
    year,
    user.master_url,
    location.state.room,
    user.sopnoid,
    location.state.taskID,
  ]);

  return (
    <div>
      <MainCard
        title="TimeSheet"
        button={
          <Button
            variant="text"
            className="fs-4"
            color="primary"
            onClick={() => {
              //back one step
              window.history.back();
            }}
          >
            <BiArrowBack />
          </Button>
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth color="warning">
                  <InputLabel id="demo-simple-select-label">
                    Assigner
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedAssigner}
                    label="Assigner"
                    onChange={(e) => {
                      setSelectedAssigner(e.target.value);

                      setComponentChng(false);
                    }}
                  >
                    {location.state.admin ? (
                      adminAndAssigner?.map((assigner) => (
                        <MenuItem
                          key={assigner?.as_gid}
                          value={assigner?.as_gid}
                        >
                          {assigner?.as_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value={check?.as_gid}>
                        {check?.as_name}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label="Date"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField color="warning" fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth color="warning">
                  <InputLabel id="demo-simple-select-label5">
                    ScreenShot
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label5"
                    id="demo-simple-select5"
                    defaultValue={selectedSessionOrScreenShot}
                    label="ScreenShot"
                    onChange={(e) =>
                      setSelectedSessionOrScreenShot(e.target.value)
                    }
                  >
                    <MenuItem value="ScreenShot">ScreenShot</MenuItem>
                    <MenuItem value="Session">Session</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            {selectedSessionOrScreenShot === "ScreenShot" ? (
              <Time
                assignerData={assignerData}
                selectedAssigner={selectedAssigner}
                componentChng={componentChng}
                setComponentChng={setComponentChng}
              />
            ) : (
              <Session day={day} month={month} year={year} />
            )}
          </Grid>
        </Grid>
      </MainCard>
    </div>
  );
};

export default React.memo(TimeSheet);
