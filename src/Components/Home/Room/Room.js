/* eslint-disable array-callback-return */
import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { BsList } from "react-icons/bs";
import { BiGridAlt } from "react-icons/bi";
import { GoDiffAdded } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsHandIndexThumbFill } from "react-icons/bs";
import SubCard from "../../Shared/SubCard/SubCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import "./room.css";
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import NewTaskModal from "./NewTaskModal/NewTaskModal";
import { useNavigate } from "react-router-dom";
// import Tracker from "./Tracker/Tracker";
import useAuth from "./../../../Hooks/useAuth";

const Room = () => {
  useEffect(() => {
    document.title = "Ghorami Desk - Room";
  }, []);
  // task add in array of tasks
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { roomId } = useParams();
  const [serviceID, setServiceID] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { pageRefresh, setPageRefresh } = useAuth();
  // const [dataValue, setDataValue] = useState([]);

  const [state, setState] = useState({
    New: {
      title: "New",
      items: [],
    },
    InProgress: {
      title: "In Progress",
      items: [],
    },
    complete: {
      title: "Complete",
      items: [],
    },
    payment: {
      title: "Payment",
      items: [],
    },
  });

  // console.log(roomId);
  // console.log(state);
  useEffect(() => {
    setState({
      New: {
        title: "New",
        items: [],
      },
      InProgress: {
        title: "In Progress",
        items: [],
      },
      complete: {
        title: "Complete",
        items: [],
      },
      payment: {
        title: "Payment",
        items: [],
      },
    });
    setLoaded(false);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("SopnoID", user?.sopnoid);
    urlencoded.append("action", "fetch");
    urlencoded.append("room", roomId);
    urlencoded.append("stas", "1");

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${user.master_url}/profile/login/api/utask_list.php`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const dataParsed = JSON.parse(result);
        // setDataValue(dataParsed);
        const values = dataParsed?.sort((a, b) =>
          a.position > b.position ? 1 : -1
        );
        // console.log(values);
        for (let i = 0; i < values.length; i++) {
          setServiceID(values[i]?.service);
          // push data object in the state new item array

          if (values[i].tstatus === "1" || values[i].tstatus === null) {
            setState((prevState) => ({
              ...prevState,
              New: {
                title: "New",
                // items: [values[i]],
                items: [...prevState.New.items, values[i]],
              },
            }));
          }
          // push data object in the state in progress item array
          if (values[i].tstatus === "2") {
            setState((prevState) => ({
              ...prevState,
              InProgress: {
                title: "In Progress",
                // items: [values[i]],
                items: [...prevState.InProgress.items, values[i]],
              },
            }));
          }
          // push data object in the state complete item array
          if (values[i].tstatus === "3") {
            setState((prevState) => ({
              ...prevState,
              complete: {
                title: "Complete",
                // items: [values[i]],
                items: [...prevState.complete.items, values[i]],
              },
            }));
          }
          // push data object in the state payment item array
          if (values[i].tstatus === "4") {
            setState((prevState) => ({
              ...prevState,
              payment: {
                title: "Payment",
                // items: [values[i]],
                items: [...prevState.payment.items, values[i]],
              },
            }));
          }
        }
      })
      .catch((error) => console.log("error", error));
  }, [user?.master_url, user?.sopnoid, roomId, pageRefresh, loaded]);

  //drag end
  // console.log(serviceID);
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // console.log(
    //   destination.index.toString(),
    //   source.droppableId,
    //   destination.droppableId
    // );
    // data value get indivisual item reffer id
    // const data = dataValue.find((item) => item.trefer === result.draggableId);
    // console.log(data);

    if (!source) return;
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });

    const formData = new FormData();
    // make increase condition if destination index increase
    if (destination.droppableId === "New" && destination.index > source.index) {
      formData.append("position_mode", "increase");
    }
    if (
      destination.droppableId === "InProgress" &&
      destination.index > source.index
    ) {
      formData.append("position_mode", "increase");
    }
    if (
      destination.droppableId === "complete" &&
      destination.index > source.index
    ) {
      formData.append("position_mode", "increase");
    }
    if (
      destination.droppableId === "payment" &&
      destination.index > source.index
    ) {
      formData.append("position_mode", "increase");
    }
    // make decrease condition if destination index decrease
    if (destination.droppableId === "New" && destination.index < source.index) {
      formData.append("position_mode", "decrease");
    }
    if (
      destination.droppableId === "InProgress" &&
      destination.index < source.index
    ) {
      formData.append("position_mode", "decrease");
    }
    if (
      destination.droppableId === "complete" &&
      destination.index < source.index
    ) {
      formData.append("position_mode", "decrease");
    }
    if (
      destination.droppableId === "payment" &&
      destination.index < source.index
    ) {
      formData.append("position_mode", "decrease");
    }

    formData.append("poster", user?.sopnoid);
    formData.append("room_id", roomId);
    formData.append("task_refer", result.draggableId);
    if (destination.droppableId === "New") {
      formData.append("status", (result.source.index = 1).toString());
    }
    if (destination.droppableId === "InProgress") {
      formData.append("status", (result.source.index = 2).toString());
    }
    if (destination.droppableId === "complete") {
      formData.append("status", (result.source.index = 3).toString());
    }
    if (destination.droppableId === "payment") {
      formData.append("status", (result.source.index = 4).toString());
    }
    formData.append("ptype", "task");
    formData.append("position", destination.index.toString());
    fetch(`${user.master_url}/profile/login/api/utask_position_new.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result[0]?.message);
        // window.location.reload();

        setPageRefresh(!pageRefresh);
      });
  };
  //add new task
  const addItem = () => {
    handleOpen();
  };
  const handleTracker = (referId) => {
    // console.log(referId);
    navigate(`/tracker/${referId}`, {
      state: {
        room: roomId,
        serviceID: serviceID,
        loaded: loaded,
      },
    });
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          fontSize: "1.8rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Button
            sx={{
              fontSize: "1.8rem",
            }}
          >
            <BsList
              style={{
                color: "#FD8040",
              }}
            />
          </Button>
          <Button
            sx={{
              fontSize: "1.8rem",
            }}
          >
            <BiGridAlt
              style={{
                color: "#FD8040",
              }}
            />
          </Button>
        </Box>
        <Box>
          <Button
            sx={{
              fontSize: "1.8rem",
            }}
            onClick={addItem}
            // add new task button click
          >
            <GoDiffAdded
              style={{
                color: "#FD8040",
              }}
            />
          </Button>
          <NewTaskModal
            open={open}
            handleClose={handleClose}
            setState={setState}
            serviceID={serviceID}
            roomId={roomId}
            setLoaded={setLoaded}
            loaded={loaded}
          />
        </Box>
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        style={{
          backgroundColor: "#F7F6F4",
          marginTop: "1rem",
          height: "100%",
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            // console.log(data);
            return (
              <Grid item xs={12} sm={4} md={3} key={key}>
                <SubCard
                  style={{
                    backgroundColor: "transparent",
                    border: "2px dashed #98989C",
                    // width:"250px",
                    // margin: "0 auto",
                  }}
                >
                  <div className={"column"}>
                    <Box
                      sx={{
                        display: "flex",
                        fontSize: "1rem",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {data?.title}{" "}
                        <span
                          style={{
                            color: "#FD8040",
                          }}
                        >
                          ({data?.items?.length})
                        </span>
                      </h5>
                      <div>
                        <HiDotsHorizontal
                          style={{
                            fontSize: "1.5rem",
                          }}
                        />
                      </div>
                    </Box>
                    <Droppable droppableId={key}>
                      {(provided, snapshot) => {
                        // console.log(snapshot);
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={"droppable-col"}
                          >
                            {data?.items?.map((el, index) => {
                              // console.log(el);
                              return (
                                <Draggable
                                  key={el?.trefer}
                                  index={index}
                                  draggableId={el?.trefer?.toString()}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        className={`item ${
                                          snapshot.isDragging && "dragging"
                                        }`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Box
                                          style={{
                                            borderRadius: "1rem",
                                            backgroundColor: "#fff",
                                            padding: "1rem",
                                            marginBottom: "1rem",
                                          }}
                                        >
                                          <div className={"column"}>
                                            <span
                                              style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                display: "block",
                                              }}
                                            >
                                              {el?.ttitle}
                                              {/* index-{index} */}
                                            </span>
                                            <span
                                              style={{
                                                fontSize: "1rem",
                                                display: "block",
                                                color: "#A4A4A4",
                                              }}
                                              title={el?.tnote}
                                            >
                                              {el?.tnote.length > 100
                                                ? el?.tnote.slice(0, 50) + "..."
                                                : el?.tnote}
                                            </span>
                                            <span
                                              style={{
                                                borderRadius: "5px",

                                                display: "block",
                                                width: "fit-content",
                                              }}
                                            >
                                              {el?.create_date}
                                            </span>
                                            {el?.expire_date ===
                                            "null" ? null : (
                                              <span
                                                style={{
                                                  borderRadius: "5px",

                                                  display: "block",
                                                  width: "fit-content",
                                                }}
                                              >
                                                {el?.expire_date}
                                              </span>
                                            )}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                              }}
                                            >
                                              {el?.priority == 0 && (
                                                <Button
                                                  variant="outlined"
                                                  color="primary"
                                                  sx={{
                                                    fontWeight: " bold",
                                                    color: "#4AC4E2",
                                                  }}
                                                >
                                                  Low
                                                </Button>
                                              )}
                                              {el?.priority == 1 && (
                                                <Button
                                                  variant="outlined"
                                                  color="secondary"
                                                  sx={{
                                                    fontWeight: " bold",
                                                    color: "#7E84C1",
                                                  }}
                                                >
                                                  Medium
                                                </Button>
                                              )}
                                              {el?.priority == 2 && (
                                                <Button
                                                  variant="outlined"
                                                  color="warning"
                                                  sx={{
                                                    fontWeight: " bold",
                                                    color: "#FD7229",
                                                  }}
                                                >
                                                  Top
                                                </Button>
                                              )}
                                              {el?.priority == 3 && (
                                                <Button
                                                  variant="outlined"
                                                  color="error"
                                                  sx={{
                                                    fontWeight: " bold",
                                                    color: "#DB0909",
                                                  }}
                                                >
                                                  High
                                                </Button>
                                              )}
                                              <Button
                                                variant="contained"
                                                onClick={() =>
                                                  handleTracker(el?.trefer)
                                                }
                                              >
                                                Tracker
                                              </Button>
                                            </Box>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mt: 2,
                                                color: "#ff0000",
                                              }}
                                            >
                                              <BsHandIndexThumbFill />
                                              {/* refer-{el?.trefer} */}
                                              <Avatar
                                                alt="Remy Sharp"
                                                src={el?.userpic}
                                                sx={{ width: 24, height: 24 }}
                                              />
                                            </Box>
                                            {/* {index} */}
                                          </div>
                                        </Box>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </SubCard>
              </Grid>
            );
          })}
        </DragDropContext>
      </Grid>
    </div>
  );
};

export default React.memo(Room);
