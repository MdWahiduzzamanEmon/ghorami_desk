import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { Divider } from "@mui/material";
import { FiRefreshCcw } from "react-icons/fi";
import { RiAddBoxLine } from "react-icons/ri";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ChecklistModal from "./CheckListModal/ChecklistModal";
import CheckListStatusChngModal from "./CheckListStatusChngModal/CheckListStatusChngModal";
import useAuth from "./../../../../../Hooks/useAuth";

const CheckList = ({ trackerId, admin }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [datas, setDatas] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [checked, setChecked] = React.useState(false);
  const [singleData, setSingleData] = React.useState({});
  const [reload, setReload] = React.useState(false);
  const { pageRefresh, setPageRefresh } = useAuth();
  const [searchValue, setSearchValue] = React.useState("");
  // const [singleCheck, setSingleCheck] = React.useState({});

  React.useEffect(() => {
    const formData = new FormData();
    formData.append("action", "fetch");
    formData.append("SopnoID", user?.sopnoid);
    formData.append("task", trackerId);
    formData.append("room", location.state.room);
    axios
      .post(
        `${user.master_url}/profile/login/api/utask_check_all_w.php`,
        formData
      )
      .then((res) => {
        setDatas(res.data);
        // console.log(res.data);
        const filterData = res.data.filter((item) => {
          return item.ch_details
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        });
        setDatas(filterData);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [
    trackerId,
    location.state.room,
    user.sopnoid,
    user.master_url,
    reload,
    pageRefresh,
    searchValue,
  ]);

  const handleOpenModal = (e, data) => {
    // console.log(checked);
    setChecked(e.target.checked);
    setSingleData(data);
    handleOpen1();
  };
  const handleReload = () => {
    setReload(!reload);
  };
  return (
    <Box
      sx={{
        m: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
            md: "center",
          },
          justifyContent: {
            xs: "flex-start",
            sm: "space-between",
            md: "space-between",
          },
          flexWrap: "wrap",
          flexDirection: {
            xs: "column",
            sm: "row",
            md: "row",
          },
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            marginTop: ".5rem",
            // paddingLeft: "1rem",
          }}
        >
          CheckList{" "}
          <span
            style={{
              color: "#ff0000",
            }}
          >
            ({datas?.length})
          </span>
        </span>

        <FiRefreshCcw
          onClick={handleReload}
          style={{
            fontSize: "1.4rem",
            color: "#ff0000",
            cursor: "pointer",
          }}
        />
        {/* </Button> */}
        <Box>
          {admin && (
            <Button
              variant="outlined"
              sx={{
                my: 0.5,
                mr: 1,
              }}
              size="small"
              color="warning"
              onClick={handleOpen}
            >
              <RiAddBoxLine
                style={{
                  fontSize: "1.4rem",
                  color: "#ff0000",
                }}
              />
            </Button>
          )}
          {/* new Checklist add modal  */}
          <ChecklistModal
            open={open}
            handleClose={handleClose}
            trackerId={trackerId}
            setPageRefresh={setPageRefresh}
            pageRefresh={pageRefresh}
          />
        </Box>
      </Box>
      <Box>
        <TextField
          id="outlined-basic2"
          type="search"
          variant="outlined"
          size="small"
          // value={searchValue}
          label="Search Checklist"
          color="warning"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Box>

      <Box
        sx={{
          m: 1,
          overflowY: datas.length > 4 ? "scroll" : "hidden",
          height:
            window.innerHeight >= 500
              ? "calc(100vh - 400px)"
              : "calc(100vh - 100px)",
        }}
      >
        {datas?.length === 0 && (
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#ff0000",
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            No Checklist Found
          </span>
        )}
        {datas?.length > 0 &&
          datas?.map((data, index) => (
            <FormGroup
              key={index}
              sx={{
                mb: 1,
                borderBottom: "1px solid #ced4da",
                pb: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    color="warning"
                    defaultChecked={data?.stats === "2" ? true : false}
                  />
                }
                onChange={(e) => {
                  handleOpenModal(e, data);
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {data?.ch_details}{" "}
                      {data?.stats === "1" && (
                        <span
                          style={{
                            fontSize: ".7rem",
                          }}
                        >
                          -New
                        </span>
                      )}
                      {data?.stats === "2" && (
                        <span
                          style={{
                            fontSize: ".7rem",
                          }}
                        >
                          -Complete
                        </span>
                      )}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#97ACB7",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {data?.poster_name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {data?.ch_time}
                    </span>
                  </Box>
                }
              />
              {/* status change modal  */}
              <CheckListStatusChngModal
                open1={open1}
                handleClose1={handleClose1}
                data={singleData}
                checked={checked}
                setReload={setReload}
                reload={reload}
              />
            </FormGroup>
          ))}
      </Box>
      <Divider />
    </Box>
  );
};

export default React.memo(CheckList);
