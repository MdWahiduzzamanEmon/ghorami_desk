import React from "react";
import { RiTimer2Line } from "react-icons/ri";
import { Box } from "@mui/material";

const LiveClock = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval();
    }
  }, [])

  return (
    <div>
      <span
        style={{
          color: "#000",
          fontSize: "1rem",
          marginRight: "1rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", 
        }}
      >
        <Box
          sx={[
            {
              display: {
                sm: "none",

                md: "inline-block",
              },
              animation: "rotate 2s ease-in-out infinite",
              "@keyframes rotate": {
                from: {
                  transform: "rotate(0deg)",
                  // make different style
                },
                to: {
                  transform: "rotate(360deg)",
                },
              },
            },
          ]}
        >
          <RiTimer2Line
            style={{
              // marginTop: "1rem",
              fontSize: "1.2rem",
            }}
          />
        </Box>{" "}
        <span>{time?.toLocaleTimeString()}</span>
      </span>
    </div>
  );
};

export default React.memo(LiveClock);
