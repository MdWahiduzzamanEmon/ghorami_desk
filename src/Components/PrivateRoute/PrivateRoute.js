import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import useAuth from "../../Hooks/useAuth";

let temp = "";

const PrivateRoute = ({ children }) => {
  const [ip, setIp] = React.useState("");
  const { setPageRefresh, pageRefresh } = useAuth();

  //get the current url
  const location = useLocation();

  // console.log(location.search);
  const queryValue = location.search?.split("?")[1];
  // console.log(queryValue);
  const splitQueryValue = queryValue?.split("&");
  // console.log(splitQueryValue);
  const sopnoID = splitQueryValue?.[0];
  const roomID = splitQueryValue?.[2];
  const name = splitQueryValue?.[1];
  const [check, setCheck] = React.useState(
    location.search.length > 0 ? true : false
  );

  const dataCall =React.useCallback( () => {
    const formData = new FormData();
    formData.append("SopnoID", sopnoID);
    formData.append("action_type", name);
    axios
      .post(
        "https://ghorami.com/profile/login/api/uinsert_sesion.php",
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setCheck(false);
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("ip", JSON.stringify(ip));
        localStorage.setItem("temp", temp);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ip, name, sopnoID]);

  useEffect(() => {
    if (location.search.length > 0) {
      axios.get("https://geolocation-db.com/json/").then((res) => {
        setIp?.(res.data.IPv4);
      });
      setPageRefresh(!pageRefresh);
      dataCall();
    }
  }, [dataCall, location?.search, pageRefresh, setPageRefresh]);

  

  // localStorage.setItem("user", JSON.stringify("fyvgb"));
  const user = JSON.parse(localStorage.getItem("user"));

  // console.log(user);
  if (check && !user) {
    return (
      <div className="text-center py-5">
        <Spinner animation="grow" variant="dark" />
      </div>
    );
  }

  if (user && location.search?.length === 0 && user?.sopnoid) {
    return children;
  } else if (location.search.length > 0 && sopnoID && name === "room") {
    return roomID ? (
      <Navigate to={`/${name}/${roomID}`} state={{ from: location.pathname }} />
    ) : (
      <Navigate to={`/${name}`} state={{ from: location.pathname }} />
    );
  } else if (location.search.length > 0 && sopnoID && name === "message") {
    return <Navigate to={`/${name}`} state={{ from: location.pathname }} />;
  } else {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
};

export default PrivateRoute;
