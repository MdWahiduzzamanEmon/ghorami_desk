import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
// import { Spinner } from "react-bootstrap";
import AuthProvider from "./Context/AuthProvider";
import { Box } from "@mui/material";
import loading from "./Components/Vendors/Images/loading.gif";
const Routing = React.lazy(() => import("./Components/Routing/Routing.js"));

function App() {
  return (
    <div>
      
      <AuthProvider>
        <Suspense
          fallback={
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* <Spinner animation="border" role="status" variant="success" /> */}
              <img src={loading} alt="loading" className="img-fluid" />
            </Box>
          }
        >
          <BrowserRouter>
            <Routing />
          </BrowserRouter>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
