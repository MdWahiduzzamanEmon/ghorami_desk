import axios from "axios";
import React, { useEffect } from "react";
import { Box } from "@mui/material";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { GoPrimitiveDot } from "react-icons/go";
import { Avatar } from "@mui/material";
import { Table } from "react-bootstrap";

const Session = ({ day, month, year }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [sessionData, setSessionData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  // console.log(sessionData);
  const date = new Date();
  const time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user?.sopnoid);
    formData.append("day", day);
    formData.append("month", month);
    formData.append("year", year);
    formData.append("time", time);
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_session_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        // setLoader(false);
        setSessionData(res.data.reverse());
      });
  }, [user?.master_url, user?.sopnoid, day, month, year, time, loader]);

  useEffect(() => {
    let interval = setInterval(() => {
      setLoader(!loader);
    }, 10000);
    return () => clearInterval(interval);
  }, [loader]);
  return (
    <Box
      sx={{
        height:
          window.innerHeight >= 500
            ? "calc(100vh - 300px)"
            : "calc(100vh - 120px)",
        overflowY: sessionData.length > 10 ? "scroll" : "hidden",
      }}
    >
      {/* //bootstrap table  */}
      <Table bordered hover responsive size="sm">
        <thead>
          <tr
            style={{
              color: "#2ABF7C",
            }}
          >
            <th className="text-center">Sl. No.</th>
            <th className="text-center">Status</th>
            <th>Name</th>
            <th>In Date</th>
            <th>In Time</th>
            <th>Out Date</th>
            <th>Out Time</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {sessionData?.map((row, i) => (
            <tr key={i}>
              <td className="text-center">{i + 1}</td>
              <td className="text-center">
                {row?.state === "1" ? (
                  <GoPrimitiveDot
                    style={{
                      color: "#2ABF7C",
                      fontSize: "20px",
                    }}
                  />
                ) : (
                  <GoPrimitiveDot
                    style={{
                      color: "gray",
                      fontSize: "20px",
                    }}
                  />
                )}
              </td>
              <td>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  <Box ml={1}>{row?.name}</Box>
                </Box>
              </td>
              <td>{row?.intime?.split(" ")[0]}</td>
              <td
                style={{
                  backgroundColor: "#4EC6B3",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {row?.intime?.split(" ")[1]}
              </td>
              <td>{row?.outtime?.split(" ")[0]}</td>
              <td
                style={{
                  backgroundColor: "#F8C43C",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {row?.outtime?.split(" ")[1]}
              </td>
              <td
                style={{
                  backgroundColor: "#6367C6",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {row?.ip}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default React.memo(Session);
