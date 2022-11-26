import React, { useEffect, useState } from "react";
import MainCard from "./../../../Shared/MainCard/MainCard";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { BsThreeDots } from "react-icons/bs";

import { MdStopCircle } from "react-icons/md";
import { RiAddBoxLine } from "react-icons/ri";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import NewAllRoomAddModal from "./NewAllRoomAddModal/NewAllRoomAddModal";
import axios from "axios";
import DashBoardAlert from "../../Dashboard/DashBoardAlert/DashBoardAlert";
import useAuth from "../../../../Hooks/useAuth";
import EditAllRoomModal from "./EditAllRoomModal/EditAllRoomModal";

const AllRoom = () => {
  useEffect(() => {
    document.title = "Ghorami Desk - All Rooms";
  }, []);

  const { noteData } = useAuth();

  const [characters, updateCharacters] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [loader, setLoader] = React.useState(true);
  const [pageRefresh, setPageRefresh] = React.useState(false);
  // const [search, setSearch] = React.useState("");

  // modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //modal two for view and edit
  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(!open1);
  const handleClose1 = () => {
    setOpen1(!open1);
  };
  //get data
  const [roomId, setRoomId] = useState("");
  useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user?.sopnoid);
    formData.append("action", "fetch");
    fetch(`${user?.master_url}/profile/login/api/uroom_all.php`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        updateCharacters(data);
        setLoader(false);
      })
      .catch((res) => console.log(res));
  }, [user?.master_url, user?.sopnoid, pageRefresh]);

  function handleOnDragEnd(result) {
    console.log(
      result.source?.index,
      result.destination?.index,
      result.draggableId
    );
    if (!result.source) return;
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // console.log(items);
    updateCharacters(items);

    const formData = new FormData();
    formData.append("poster", user?.sopnoid);
    formData.append("room_id", result?.draggableId);
    formData.append("ptype", "room");
    formData.append("status", "");
    formData.append("position", result.destination.index.toString());

    axios
      .post(
        `${user?.master_url}/profile/login/api/utask_status_new.php`,
        formData
      )
      .then((res) => {
        console.log(res.data);
        // setPageRefresh(!pageRefresh);
        // const items = Array.from(characters);
        // const [reorderedItem] = items.splice(result.source.index, 1);
        // items.splice(result.destination.index, 0, reorderedItem);
        // console.log(items);
        // updateCharacters(items);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //individual room
  const handleRoomClick = (room) => {
    navigate(`/room/${room}`);
  };

  const handleRoomAddModal = () => {
    handleOpen();
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MainCard
            title="All Room"
            style={
              {
                // backgroundColor: "#f5f5f5",
              }
            }
            button={
              <>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{
                    fontSize: "25px",
                  }}
                  onClick={() => {
                    handleRoomAddModal();
                  }}
                >
                  <RiAddBoxLine />
                </Button>
                <NewAllRoomAddModal open={open} handleClose={handleClose} />
              </>
            }
            search={
              <TextField
                id="standard-basic"
                label="Search"
                type="search"
                variant="outlined"
                color="warning"
                size="small"
                onChange={(e) => {
                  // setSearch(e.target.value);
                  const formData = new FormData();
                  formData.append("SopnoID", user?.sopnoid);
                  formData.append("action", "fetch");
                  formData.append("room_it", e.target.value);
                  axios
                    .post(
                      `${user?.master_url}/profile/login/api/uroom_search.php`,
                      formData
                    )
                    .then((res) => {
                      updateCharacters(res.data);
                    });
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            }
          >
            {loader ? (
              <Box
                sx={{
                  p: "10px",
                  width: "100%",
                }}
              >
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </Box>
            ) : (
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <Box
                      className="characters"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {characters?.map((character, index) => {
                        return (
                          <Draggable
                            key={character?.room}
                            draggableId={character?.room}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={[
                                  {
                                    mb: 3,
                                    backgroundColor: "#fff",
                                    borderRadius: "5px",
                                    transition: ".5s ease-in-out all",
                                    "&:hover": {
                                      boxShadow:
                                        " rgba(0, 0, 0, 0.1) -4px 9px 25px -6px",
                                    },
                                    "@media screen and (max-width: 768px)": {
                                      width: "100%",
                                      margin: "0 auto",
                                    },
                                  },
                                ]}
                              >
                                <Box
                                  sx={[
                                    {
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      border: "1px solid #ccc",
                                      padding: "1rem",
                                      borderRadius: "0.5rem",
                                      "@media screen and (max-width: 600px)": {
                                        width: "100%",
                                        margin: "0 auto",
                                      },
                                    },
                                  ]}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      handleRoomClick(character?.room);
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        marginRight: "1rem",
                                      }}
                                    >
                                      <MdStopCircle
                                        style={{
                                          color: `${character?.sr_color}`,
                                          fontSize: "1.5rem",
                                        }}
                                      />
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Box
                                        sx={[
                                          {
                                            fontSize: "1.5rem",
                                            fontWeight: "bold",
                                            "@media (max-width: 600px)": {
                                              fontSize: "1.3rem",
                                            },
                                          },
                                        ]}
                                      >
                                        {character?.stitle}
                                      </Box>
                                      <span title={character?.sr_details}>
                                        {character?.sr_details.length > 100
                                          ? character?.sr_details.slice(
                                              0,
                                              100
                                            ) + "..."
                                          : character?.sr_details}
                                      </span>

                                      <Box>
                                        <small
                                          style={{
                                            color: "#8BB1BC",
                                            display: "inline",
                                          }}
                                        >
                                          Created By-{character?.psname}
                                        </small>
                                        <Box
                                          sx={[
                                            {
                                              backgroundColor: "green",
                                              padding: "3px",
                                              borderRadius: "5px",
                                              color: "white",
                                              marginTop: ".5rem",
                                              display: "inline",
                                              width: "fit-content",
                                              fontSize: ".8rem",
                                              ml: "1rem",
                                              "@media (max-width: 600px)": {
                                                fontSize: ".8rem",
                                                display: "block",
                                                ml: 0,
                                              },
                                            },
                                          ]}
                                        >
                                          {character?.create_time}
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box>
                                    <Box sx={{ flexGrow: 0 }}>
                                      <Button
                                        variant="outlined"
                                        color="success"
                                        size="small"
                                        sx={{
                                          boxShadow: "none",
                                        }}
                                        onClick={() => {
                                          handleOpen1();
                                          setRoomId(character?.room);
                                        }}
                                      >
                                        <span>
                                          <BsThreeDots />
                                        </span>
                                      </Button>
                                      <EditAllRoomModal
                                        roomId={roomId}
                                        handleClose1={handleClose1}
                                        open1={open1}
                                        setPageRefresh={setPageRefresh}
                                        pageRefresh={pageRefresh}
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </MainCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={[
              {
                backgroundColor: "#fff",
                borderRadius: "5px",
                padding: "1rem",
                height: noteData.length > 6 ? "700px" : "auto",
                overflow: noteData.length > 6 ? "scroll" : "hidden",
              },
            ]}
          >
            <Typography
              variant="h5"
              gutterBottom
              component="div"
              sx={{
                fontWeight: "bold",
                color: "text.secondary",
              }}
            >
              Notes
            </Typography>
            <DashBoardAlert noteData={noteData} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(AllRoom);
