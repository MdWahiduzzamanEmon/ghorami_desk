// import React, { useRef, useEffect, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// import { useNavigate, useParams } from "react-router-dom";
// import { Box, Button, Grid, Stack, Typography } from "@mui/material";
// import VideocamIcon from '@mui/icons-material/Videocam';
// import VideocamOffIcon from '@mui/icons-material/VideocamOff';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import VolumeOffIcon from '@mui/icons-material/VolumeOff';
// import CallEndIcon from '@mui/icons-material/CallEnd';

// // Streaming Video of the user
// const Video = (props) => {
//     const ref = useRef();
//     const { ...rest } = props;
//     useEffect(() => {
//         props.peer.on("stream", stream => {
//             ref.current.srcObject = stream;
//         })
//     }, [props.peer]);

//     return (
//         <video playsInline autoPlay ref={ref}
//             {...rest}
//             style={{
//                 width: "250px",
//                 height: "150px",
//                 // borderRadius: "50%",
//                 border: "5px solid #000",
//                 objectFit: "cover",
//                 margin: "10px",
//             }} />
//     )
// }

// const TrackerGroupVideo = (props) => {

//     // variables for different functionalities of video call
//     const [peers, setPeers] = useState([]);
//     const socketRef = useRef();
//     const userVideo = useRef();
//     const peersRef = useRef([]);
//     const userStream = useRef();
//     const { roomID } = useParams()
//     const navigate = useNavigate()
//     const user = JSON.parse(localStorage.getItem('user'))
//     const [usersStream, setUsersStream] = React.useState(null)

//     const [isScreenShare, setIsScreenShare] = useState(false);
//     const [screenTrack, setScreenTrack] = React.useState(null)

//     // "https://yeapbe.com:3400/"
//     // http://localhost:8080/
//     const data = React.useMemo(() => {
//         return {
//             roomID: roomID,
//             userName: user?.uname
//         }
//     }, [roomID, user?.uname])

//     useEffect(() => {
//         socketRef.current = io.connect("https://yeapbe.com:3450", {
//             transports: ["websocket"],

//         });

//         // asking for audio and video access
//         const playVideoFromCamera = async () => {
//             try {
//                 const constraints = {
//                     "video": {
//                         "width": {
//                             "min": 640,
//                             "max": 1024
//                         },
//                         "height": {
//                             "min": 480,
//                             "max": 768
//                         },
//                         "frameRate": {
//                             "min": 15,
//                             "max": 30
//                         }
//                         ,
//                         "facingMode": "user",
//                         "aspectRatio": 1.33333,
//                         "resizeMode": "crop-and-scale",
//                         "deviceId": user?.sopnoid,
//                         "cursor": "never",
//                         "displaySurface": 'application' | 'browser' | 'monitor' | 'window',
//                         "logicalSurface": true,
//                         "noiseSuppression": true,
//                         "echoCancellation": true,
//                         "autoGainControl": true,
//                         "sampleRate": 48000,
//                         "sampleSize": 16,
//                         "exact": {
//                             "deviceId": user?.sopnoid,
//                         }

//                     },
//                     'audio': {
//                         'echoCancellation': true,
//                         'noiseSuppression': true,
//                         'autoGainControl': true,
//                         'sampleRate': 48000,
//                         'sampleSize': 16,
//                         'deviceId': user?.sopnoid,

//                     }
//                 };
//                 const stream = await navigator.mediaDevices.getUserMedia(constraints);
//                 userVideo.current.srcObject = stream;
//                 userStream.current = stream;
//                 setUsersStream(stream)
//                 socketRef.current.emit("join_room", data);

//                 // getting all user for the new user joining in
//                 socketRef.current.on("all users", (users) => {
//                     console.log("all users", users);
//                     const peers = [];
//                     // adding the new user to the group
//                     users.forEach(userID => {
//                         const peer = createPeer(userID?.socketId, socketRef.current.id, stream, userID?.userName);
//                         peersRef.current.push({
//                             peerID: userID?.socketId,
//                             peer,
//                             userName: userID?.userName
//                         })
//                         peers.push({
//                             peerID: userID?.socketId,
//                             peer,
//                             userName: userID?.userName
//                         });
//                     })

//                     setPeers(peers);
//                 })

//                 // sending signal to existing users after new user joined
//                 socketRef.current.on("user joined", payload => {

//                     const peer = addPeer(payload.signal, payload.callerID, stream, payload.userName);
//                     peersRef.current.push({
//                         peerID: payload.callerID,
//                         peer,
//                         userName: payload.userName
//                     })

//                     const peerObj = {
//                         peer,
//                         peerID: payload.callerID,
//                         userName: payload.userName
//                     }

//                     setPeers(users => [...users, peerObj]);
//                 })

//                 // exisisting users recieving the signal
//                 socketRef.current.on("receiving returned signal", payload => {

//                     const item = peersRef.current.find(p => p.peerID === payload.id);
//                     item.peer.signal(payload.signal);

//                 });

//                 // handling user disconnecting
//                 socketRef.current.on("user left", id => {
//                     // finding the id of the peer who just left
//                     const peerObj = peersRef.current.find(p => p.peerID === id);
//                     if (peerObj) {
//                         peerObj.peer.destroy();
//                         peersRef.current = peersRef.current.filter(p => p.peerID !== id);
//                         setPeers(peersRef.current);

//                     }

//                     // removing the peer from the arrays and storing remaining peers in new array
//                     const peers = peersRef.current.filter(p => p.peerID !== id);
//                     peersRef.current = peers;
//                     setPeers(
//                         peersRef.current.map(peer => {
//                             return {
//                                 peerID: peer.peerID,
//                                 peer: peer.peer,
//                                 userName: peer.userName
//                             }
//                         }
//                         )
//                     );
//                 })
//             } catch (error) {
//                 console.error('Error opening video camera.', error);
//                 alert("Please allow access to audio and video")
//             }
//         }
//         playVideoFromCamera();
//     }, [data, user?.sopnoid]);
//     // creating a peer object for newly joined user
//     function createPeer(userToSignal, callerID, stream, userName) {
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("sending signal", { userToSignal, callerID, signal, userName })
//         })

//         return peer;
//     }

//     // adding the newly joined peer to the room
//     function addPeer(incomingSignal, callerID, stream, userName) {
//         const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             stream,
//         })

//         peer.on("signal", signal => {
//             socketRef.current.emit("returning signal", { signal, callerID, userName })
//         })

//         peer.signal(incomingSignal);
//         return peer;
//     }

//     // let peer = addPeer(incomingSignal, callerId, stream);
//     // peer.signal(incomingSignal);

//     function shareScreen() {
//         navigator.mediaDevices.getDisplayMedia({
//             video: {
//                 cursor: "always"
//             },
//             audio: {
//                 echoCancellation: true,
//                 noiseSuppression: true
//             }

//         }).then(stream => {
//             if (stream.active === true) {
//                 setIsScreenShare(true);
//             }

//             let track = stream.getTracks()[0];
//             setScreenTrack(track)
//             peersRef.current.forEach(peer => {
//                 // removeStream(userStream.current);
//                 peer.peer.replaceTrack(userStream.current.getVideoTracks()[0], track, userStream.current);
//             })

//             userVideo.current.srcObject = stream;
//             userStream.current = stream;
//             track.onended = function () {
//                 userVideo.current.srcObject = usersStream;
//                 userStream.current = usersStream;
//                 peersRef.current.forEach(peer => {
//                     peer.peer.replaceTrack(track, userStream.current.getVideoTracks()[0], usersStream);
//                 })
//                 setIsScreenShare(false);
//             }

//         }).catch(err => {
//             console.log(err);
//             alert(err);
//         })
//     }

//     const stopScreenShare = () => {
//         userVideo.current.srcObject = usersStream;
//         userStream.current = usersStream;
//         peersRef.current.forEach(peer => {
//             peer.peer.replaceTrack(userStream.current.getVideoTracks()[0], usersStream.getVideoTracks()[0], usersStream);
//         })
//         setIsScreenShare(false);
//         screenTrack.stop();
//     }

//     // Toggle Video
//     const [isVideo, setIsVideo] = useState(false);
//     function toggleVideo() {
//         setIsVideo(!isVideo);
//         userStream.current.getVideoTracks()[0].enabled = isVideo;
//     }

//     // Toggle Audio
//     const [isAudio, setIsAudio] = useState(false);
//     function toggleAudio() {
//         setIsAudio(!isAudio);
//         userStream.current.getAudioTracks()[0].enabled = isAudio;
//     }

//     // Hanging up the call
//     function hangUp() {
//         if (userVideo.current.srcObject) {
//             userStream.current.getVideoTracks()[0].enabled = false;
//             userStream.current.getAudioTracks()[0].enabled = false;
//             peersRef.current.forEach(p => {
//                 p.peer.destroy();
//             })
//             socketRef.current.disconnect();
//             const stream = userVideo.current.srcObject;
//             const tracks = stream.getTracks();
//             tracks.forEach(function (track) {
//                 track.stop();
//                 userVideo.current.srcObject = null;
//             });

//             navigate(`/room/${roomID}`);
//         } else {
//             alert("No active call")
//             navigate(`/room/${roomID}`);
//         }
//     }

//     return (
//         <Box sx={{
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'stretch',
//             justifyContent: 'space-between',
//         }}>
//             <Grid container spacing={2}>
//                 <Grid item xs={12} md={
//                     peers.length > 0 ? 8 : 12
//                 }>

//                     <Box sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',

//                     }}>
//                         <video
//                             ref={userVideo}
//                             autoPlay
//                             playsInline
//                             controls={true}
//                             controlsList={
//                                 isScreenShare && "nofullscreen"
//                             }
//                             muted
//                             style={{
//                                 maxWidth: peers.length > 0 ? '800px' : '1000px',
//                                 maxHeight: peers.length > 0 ? '400px' : '450px',
//                                 width: "100%",
//                                 height: "100%",
//                                 borderRadius: "10px",
//                                 border: "5px solid #000",
//                                 objectFit: "cover",
//                                 margin: "10px",

//                             }}
//                         />
//                         <Typography variant="subtitle2" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: "bold" }}>
//                             {user?.uname}
//                         </Typography>
//                     </Box>
//                     <div>
//                         <Stack
//                             direction="row"
//                             spacing={1}
//                             justifyContent="center"
//                             alignItems="center"
//                         >
//                             <Button onClick={toggleAudio} size="small" variant="contained" color={
//                                 !isAudio ? "primary" : "error"
//                             }>
//                                 {!isAudio ? <VolumeUpIcon /> : <VolumeOffIcon />}
//                             </Button>
//                             <Button
//                                 onClick={hangUp}
//                                 size="small"
//                                 variant="contained"
//                                 color="error"
//                             >
//                                 {
//                                     <CallEndIcon />
//                                 }
//                             </Button>
//                             <Button onClick={toggleVideo}
//                                 size="small"
//                                 variant="contained"
//                                 color={
//                                     !isVideo ? "primary" : "error"
//                                 }
//                             >
//                                 {
//                                     !isVideo ? <VideocamIcon /> : <VideocamOffIcon />
//                                 }
//                             </Button>
//                             <Button
//                                 size="small"
//                                 variant="contained"
//                                 color={
//                                     "primary"
//                                 }
//                                 onClick={
//                                     isScreenShare ? stopScreenShare : shareScreen
//                                 }
//                             >
//                                 {

//                                     !isScreenShare ? "Share Screen" : "Stop Sharing"
//                                 }
//                             </Button>
//                         </Stack>


//                     </div>
//                 </Grid>
//                 <Grid item xs={12} md={
//                     peers.length > 0 ? 4 : 12
//                 }>
//                     <Box sx={{
//                         minHeight: "auto",
//                         maxHeight: "calc(100vh - 64px)",
//                         overflowY: "auto",
//                         overflowX: "hidden",

//                     }}>
//                         {peers?.map((peer) => {
//                             return (
//                                 <Box key={peer.peerID} sx={{
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',

//                                 }}>
//                                     <Video peer={peer.peer}
//                                         controls={true}
//                                     />

//                                     <Typography variant="subtitle2" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: "bold" }}>
//                                         {peer.userName}
//                                     </Typography>
//                                 </Box>

//                             );
//                         })}
//                     </Box>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default TrackerGroupVideo;
import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
// icons
import { IoChatboxOutline as ChatIcon } from "react-icons/io5";
import { VscTriangleDown as DownIcon } from "react-icons/vsc";
import { FaUsers as UsersIcon } from "react-icons/fa";
import { FiSend as SendIcon } from "react-icons/fi";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { MdCallEnd as CallEndIcon } from "react-icons/md";
import { MdClear as ClearIcon } from "react-icons/md";
import { AiOutlineLink as LinkIcon } from "react-icons/ai";
import { MdOutlineContentCopy as CopyToClipboardIcon } from "react-icons/md";
import { MdScreenShare as ScreenShareIcon } from "react-icons/md";
import { MdStopScreenShare as StopScreenShareIcon } from "react-icons/md";
import { IoVideocamSharp as VideoOnIcon } from "react-icons/io5";
import { IoVideocamOff as VideoOffIcon } from "react-icons/io5";
import { AiOutlineShareAlt as ShareIcon } from "react-icons/ai";
import { IoMic as MicOnIcon } from "react-icons/io5";
import { IoMicOff as MicOffIcon } from "react-icons/io5";
import { BsPin as PinIcon } from "react-icons/bs";
import { BsPinFill as PinActiveIcon } from "react-icons/bs";

// import { QRCode } from "react-qrcode-logo";
import MeetGridCard from "./MeetGridCard/MeetGridCard";

import { motion, AnimatePresence } from "framer-motion";
// import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion'

import { Spinner } from "react-bootstrap";
import { useCallback } from 'react';
import swal from "sweetalert";


const TrackerGroupVideo = (props) => {

    // variables for different functionalities of video call
    const [loading, setLoading] = useState(true);
    const [localStream, setLocalStream] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // const [micOn, setMicOn] = useState(true);
    const [showChat, setshowChat] = useState(true);
    const [share, setShare] = useState(false);
    // const [joinSound] = useState(new Audio(joinSFX));
    const { roomID } = useParams();
    // const chatScroll = useRef();
    const [pin, setPin] = useState(false);
    const [peers, setPeers] = useState([]);
    const socket = useRef();
    const peersRef = useRef([]);
    const [allUserCount, setAllUserCount] = useState(0);

    const [isVideo, setIsVideo] = useState(true);
    const [isAudio, setIsAudio] = useState(true);
    const localVideo = useRef();

    // user
    // const { user, login } = useAuth();

    const [particpentsOpen, setParticpentsOpen] = useState(true);
    // const [screenShare, setScreenShare] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    // "https://yeapbe.com:3400/"
    // http://localhost:8080/
    // const data = React.useMemo(() => {
    //     return {
    //         roomID: roomID,
    //         userName: user?.uname
    //     }
    // }, [roomID, user?.uname])
    const createPeer = useCallback((userToSignal, callerID, stream) => {

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.current.emit("sending signal", {
                userToSignal,
                callerID,
                signal,
                user: user?.sopnoid
                    ? {
                        uid: user?.sopnoid,
                        email: user?.uemail,
                        name: user?.uname,
                        photoURL: user?.userpic,
                    }
                    : null,
            });
        });

        return peer;
    }, [user?.sopnoid, user?.uemail, user?.uname, user?.userpic]);


    useEffect(() => {
        const unsub = () => {
            socket.current = io.connect(
                "http://localhost:5500"
                // https://yeapbe.com:4250/ || "http://localhost:5500"
                , {
                    transports: ["websocket"],
                }
            );
            if (user?.sopnoid) {
                navigator.mediaDevices
                    .getUserMedia({
                        video: true,
                        audio: true,
                    })
                    .then((stream) => {
                        setLoading(false);
                        setLocalStream(stream);
                        localVideo.current.srcObject = stream;
                        socket.current.emit("join room", {
                            roomID,
                            user: user?.sopnoid
                                ? {
                                    uid: user?.sopnoid,
                                    email: user?.uemail,
                                    name: user?.uname,
                                    photoURL: user?.userpic,
                                }
                                : null,
                        });
                        socket.current.on("all users", (users) => {
                            setAllUserCount(users.length);
                            const peers = [];
                            users.forEach((user) => {
                                const peer = createPeer(user.userId, socket.current.id, stream);
                                peersRef.current.push({
                                    peerID: user.userId,
                                    peer,
                                    user: user.user,
                                });
                                peers.push({
                                    peerID: user.userId,
                                    peer,
                                    user: user.user,
                                });
                            });
                            setPeers(peers);
                        });

                        socket.current.on("user joined", (payload) => {
                            // console.log(payload);
                            const peer = addPeer(payload.signal, payload.callerID, stream);
                            peersRef.current.push({
                                peerID: payload.callerID,
                                peer,
                                user: payload.user,
                            });

                            const peerObj = {
                                peerID: payload.callerID,
                                peer,
                                user: payload.user,
                            };

                            setPeers((users) => [...users, peerObj]);
                        });

                        socket.current.on("receiving returned signal", (payload) => {
                            const item = peersRef.current.find(
                                (p) => p.peerID === payload.id
                            );
                            item.peer.signal(payload.signal);
                        });

                        socket.current.on("user left", (id) => {
                            // const audio = new Audio(leaveSFX);
                            // audio.play();
                            const peerObj = peersRef.current.find((p) => p.peerID === id);
                            if (peerObj) peerObj.peer.destroy();
                            const peers = peersRef.current.filter((p) => p.peerID !== id);
                            peersRef.current = peers;
                            setPeers((users) => users.filter((p) => p.peerID !== id));
                        });

                    });
            }

        };
        return unsub();
    }, [createPeer, roomID, user?.sopnoid, user?.uemail, user?.uname, user?.userpic]);

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });
        peer.on("signal", (signal) => {
            socket.current.emit("returning signal", { signal, callerID });
        });
        // joinSound.play();
        peer.signal(incomingSignal);
        return peer;
    };
    // console.log(peers);

    // let peer = addPeer(incomingSignal, callerId, stream);
    // peer.signal(incomingSignal);

    const [screenShare, setScreenShare] = useState(false);
    const [screenTrack, setScreenTrack] = React.useState(null);

    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: "always",
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
            }

        }).then(stream => {
            if (stream.active === true) {
                setScreenShare(true);
                let track = stream.getTracks()[0];
                setScreenTrack(track)

                localStream.addTrack(stream.getVideoTracks()[0]);
                peersRef.current.forEach(peer => {
                    peer.peer.replaceTrack(localStream.getVideoTracks()[0], stream.getVideoTracks()[0], localStream);
                })
                localStream.removeTrack(localStream.getVideoTracks()[0]);
                localVideo.current.srcObject = localStream;
                setLocalStream(localStream);
                track.onended = function () {
                    // console.log("track ended");
                    setScreenShare(false);
                    navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    }).then(stream => {
                        localStream.addTrack(stream.getVideoTracks()[0]);
                        peersRef.current.forEach(peer => {
                            peer.peer.replaceTrack(localStream.getVideoTracks()[0], stream.getVideoTracks()[0], localStream);
                        }
                        )
                        localStream.removeTrack(localStream.getVideoTracks()[0]);
                        localVideo.current.srcObject = localStream;
                        setLocalStream(localStream
                        );

                    })
                }


            }
        }).catch(err => {
            console.log(err);

        }
        )
    }



    // stream.getTracks().forEach(function (track) {
    //     if (track.readyState == 'live' && track.kind === 'video') {
    //         track.stop();
    //     }
    // });

    const stopScreenShare = () => {
        setScreenShare(false);
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then(stream => {
            localStream.addTrack(stream.getVideoTracks()[0]);
            peersRef.current.forEach(peer => {
                peer.peer.replaceTrack(localStream.getVideoTracks()[0], stream.getVideoTracks()[0], localStream);
            }
            )
            localStream.removeTrack(localStream.getVideoTracks()[0]);
            localVideo.current.srcObject = localStream;
            setLocalStream(localStream
            );

        })

        // stop screenTrack 
        screenTrack.stop();


    }

    // // Toggle Video 
    function toggleVideo() {

        if (isVideo) {
            localStream.getVideoTracks()[0].enabled = false;
            setIsVideo(false);

        } else {
            localStream.getVideoTracks()[0].enabled = true;
            setIsVideo(true);
        }

    }

    // // Toggle Audio
    function toggleAudio() {
        setIsAudio(!isAudio);
        localStream.getAudioTracks()[0].enabled = !isAudio;
    }

    // // Hanging up the call
    function hangUp() {
        // const audio = new Audio(leaveSFX);
        // audio.play();
        peersRef.current.forEach((peer) => peer.peer.destroy());
        socket.current.disconnect();
        // history.push("/");
        navigate(`/tracker/${roomID}`,
            {
                state: {
                    room: location.state?.room,
                    serviceID: location.state?.serviceID,
                },
            }
        );
        const tracks = localStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        }
        );
    }

    return (
        <>
            {user && (
                <AnimatePresence>
                    {loading ? (
                        <div className="bg-lightGray">
                            <div className="flex justify-center items-center h-screen">
                                <Spinner />
                            </div>
                        </div>
                    ) : (
                        user && (
                            <motion.div
                                layout
                                className="flex flex-row bg-darkBlue2 text-white w-full"
                            >
                                <motion.div
                                    layout
                                    className="flex flex-col bg-darkBlue2 justify-between w-full"
                                >
                                    <div
                                        className="flex-shrink-0 overflow-y-scroll p-2"
                                        style={{
                                            height: "calc(100vh - 128px)",
                                        }}
                                    >
                                        <motion.div
                                            layout
                                            className={`grid grid-cols-1 gap-4  ${showChat
                                                ? "md:grid-cols-2"
                                                : "lg:grid-cols-3 sm:grid-cols-2"
                                                } `}
                                        >
                                            <motion.div
                                                layout
                                                className={`relative bg-lightGray rounded-lg aspect-video overflow-hidden ${pin &&
                                                    "md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1"
                                                    }`}
                                            >
                                                <div className="absolute top-4 right-4 z-20">
                                                    <button
                                                        className={`${pin
                                                            ? "bg-blue border-transparent"
                                                            : "bg-slate-800/70 backdrop-blur border-gray"
                                                            } md:border-2 border-[1px] aspect-square md:p-2.5 p-1.5 cursor-pointer md:rounded-xl rounded-lg text-white md:text-xl text-lg`}
                                                        onClick={() => setPin(!pin)}
                                                    >
                                                        {pin ? <PinActiveIcon /> : <PinIcon />}
                                                    </button>
                                                </div>

                                                <video
                                                    ref={localVideo}
                                                    muted
                                                    autoPlay
                                                    controls={false}
                                                    className="h-full w-full object-cover rounded-lg"
                                                />
                                                {!isVideo && (
                                                    <div className="absolute top-0 left-0 bg-black h-full w-full flex items-center justify-center">
                                                        <img
                                                            className="h-[35%] max-h-[150px] w-auto rounded-full aspect-square object-cover 
                                                            border-4 border-white shadow-lg bg-white"
                                                            src={user?.userpic}
                                                            alt={user?.uname}
                                                        />
                                                    </div>
                                                )}

                                                <div className="absolute bottom-4 right-4">
                                                    {/* <button
                          className={`${
                            micOn
                              ? "bg-blue border-transparent"
                              : "bg-slate-800/70 backdrop-blur border-gray"
                          } border-2  p-2 cursor-pointer rounded-xl text-white text-xl`}
                          onClick={() => {
                            const audio =
                              localVideo.current.srcObject.getAudioTracks()[0];
                            if (micOn) {
                              audio.enabled = false;
                              setMicOn(false);
                            }
                            if (!micOn) {
                              audio.enabled = true;
                              setMicOn(true);
                            }
                          }}
                        >
                          {micOn ? <MicOnIcon /> : <MicOffIcon />}
                        </button> */}
                                                </div>
                                                <div className="absolute bottom-4 left-4">
                                                    <div className="bg-slate-800/70 backdrop-blur border-gray border-2  py-1 px-3 cursor-pointer rounded-md text-white text-xs">
                                                        {user?.uname}
                                                    </div>
                                                </div>
                                            </motion.div>
                                            {peers.map((peer) => (
                                                // console.log(peer),
                                                <MeetGridCard
                                                    key={peer?.peerID}
                                                    user={peer.user}
                                                    peer={peer?.peer}
                                                />
                                            ))}
                                        </motion.div>
                                    </div>
                                    <div className="w-full h-16 bg-darkBlue1 border-t-2 border-lightGray p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <div>
                                                    <button
                                                        className={
                                                            isAudio ? "bg-orange-500 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl" : "bg-slate-800/70 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl"
                                                        }
                                                        onClick={() => {
                                                            // const audio =
                                                            //     localVideo.current.srcObject.getAudioTracks()[0];
                                                            // if (micOn) {
                                                            //     audio.enabled = false;
                                                            //     setMicOn(false);
                                                            // }
                                                            // if (!micOn) {
                                                            //     audio.enabled = true;
                                                            //     setMicOn(true);
                                                            // }
                                                            toggleAudio();
                                                        }}
                                                    >
                                                        {isAudio ? <MicOnIcon /> : <MicOffIcon />}
                                                    </button>
                                                </div>
                                                <div>
                                                    <button
                                                        className={
                                                            isVideo ? "bg-orange-500 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl" : "bg-slate-800/70 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl"
                                                        }
                                                        onClick={() => {
                                                            // const videoTrack = localStream
                                                            //     .getTracks()
                                                            //     .find((track) => track.kind === "video");
                                                            // console.log(videoTrack);
                                                            // if (videoActive) {
                                                            //     videoTrack.enabled = false;
                                                            // } else {
                                                            //     videoTrack.enabled = true;
                                                            // }

                                                            // setVideoActive(!videoActive);
                                                            toggleVideo();
                                                        }}
                                                    >
                                                        {isVideo ? <VideoOnIcon /> : <VideoOffIcon />}
                                                    </button>
                                                </div>
                                                <div>
                                                    <button
                                                        className={
                                                            !screenShare ? "bg-orange-500 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl" : "bg-slate-800/70 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl"
                                                        }
                                                        onClick={() => {
                                                            if (screenShare) {
                                                                stopScreenShare();
                                                            } else {
                                                                shareScreen();
                                                            }
                                                        }}
                                                    >
                                                        {!screenShare ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                                    </button>
                                                </div>


                                                {/* <div>
                          <button
                            className={`bg-blue border-transparent
           border-2  p-2 cursor-pointer rounded-xl text-white text-xl`}
                          >
                            <UsersIcon />
                          </button>
                        </div> */}
                                            </div>
                                            <div className="flex-grow flex justify-center align-middle">
                                                <Button
                                                    // className="py-2 px-4 flex items-center gap-2 rounded-lg bg-red"
                                                    onClick={() => {
                                                        // navigate("/");
                                                        // window.location.reload();
                                                        hangUp();
                                                    }}
                                                    variant="outlined"
                                                    color="error"
                                                >
                                                    <CallEndIcon size={20} />
                                                    <span className="hidden sm:block text-xs ml-1">End Call</span>

                                                </Button>
                                            </div>
                                            <div className="flex gap-2">

                                                <div>
                                                    <button
                                                        className={`bg-slate-800/70 backdrop-blur border-gray
          border-2  p-2 cursor-pointer rounded-xl text-white text-xl`}
                                                        onClick={() => setShare(true)}
                                                    >
                                                        <ShareIcon size={22} />
                                                    </button>
                                                </div>
                                                <div>
                                                    <button

                                                        className={
                                                            showChat ? "bg-orange-500 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl" : "bg-slate-800/70 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl"
                                                        }
                                                        onClick={() => {
                                                            setshowChat(!showChat);
                                                        }}
                                                    >
                                                        <UsersIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                {showChat && (
                                    <motion.div
                                        layout
                                        className="flex flex-col flex-shrink-0 border-l-2 border-lightGray bg-darkBlue1 h-full"

                                        style={{
                                            display: window.innerWidth < 768 ? "none" : "block",

                                        }}
                                    >
                                        <div
                                            className="flex-shrink-0 overflow-y-scroll"
                                            style={{
                                                height: "calc(100vh - 108px)",
                                            }}
                                        >
                                            <div className="flex flex-col bg-darkBlue1 w-full border-b-2 border-gray">
                                                <div
                                                    className="flex items-center w-full p-3 cursor-pointer"
                                                    onClick={() => setParticpentsOpen(!particpentsOpen)}
                                                >
                                                    <div className="text-xl text-slate-400">
                                                        <UsersIcon />
                                                    </div>
                                                    <div className="ml-2 text-sm font text-black">Particpents ({allUserCount + 1})</div>

                                                    <div
                                                        className={`${particpentsOpen && "rotate-180"
                                                            } transition-all  ml-auto text-lg`}
                                                    >
                                                        <DownIcon />
                                                    </div>
                                                </div>
                                                <motion.div
                                                    layout
                                                    className={`${particpentsOpen ? "block" : "hidden"
                                                        } flex flex-col w-full mt-2 h-full max-h-[80vh] overflow-y-scroll gap-3 p-1 
                                                       bg-slate-900 backdrop-blur border-b-2 border-gray
                                                        `}
                                                    style={{
                                                        scrollbarWidth: "thin",
                                                    }}
                                                >
                                                    <AnimatePresence>
                                                        <motion.div
                                                            layout
                                                            initial={{ x: 100, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ duration: 0.08 }}
                                                            exit={{ opacity: 0 }}
                                                            whileHover={{ scale: 1.05 }}
                                                            className="p-2 flex bg-gray items-center transition-all hover:bg-slate-900 gap-2 rounded-lg cursor-pointer"
                                                        >
                                                            <img
                                                                src={
                                                                    user.userpic ||
                                                                    "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
                                                                }
                                                                alt={user.uname || "Anonymous"}
                                                                className="block w-8 h-8 aspect-square rounded-full mr-2"
                                                            />
                                                            <span className="font-medium text-sm">
                                                                {user.uname || "Anonymous"}
                                                            </span>
                                                        </motion.div>
                                                        {peers.map((user) => (
                                                            <motion.div
                                                                layout
                                                                initial={{ x: 100, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ duration: 0.08 }}
                                                                exit={{ opacity: 0 }}
                                                                key={user.peerID}
                                                                whileHover={{ scale: 1.05 }}
                                                                className="p-2 flex bg-gray items-center transition-all hover:bg-slate-900 gap-2 rounded-lg cursor-pointer"
                                                            >
                                                                <img
                                                                    src={
                                                                        user.user.photoURL ||
                                                                        "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
                                                                    }
                                                                    alt={user.user.name || "Anonymous"}
                                                                    className="block w-8 h-8 aspect-square rounded-full mr-2"
                                                                />
                                                                <span className="font-medium text-sm">
                                                                    {user.user.name || "Anonymous"}
                                                                </span>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </motion.div>
                                            </div>
                                            {/* <div className="h-full">
                                                <div className="flex items-center bg-darkBlue1 p-3 w-full">
                                                    <div className="text-xl text-slate-400">
                                                        <ChatIcon />
                                                    </div>
                                                    <div className="ml-2 text-sm font">Chat</div>
                                                    <div
                                                        className="ml-auto text-lg"
                                                        onClick={() => setParticpentsOpen(!particpentsOpen)}
                                                    >
                                                        <DownIcon />
                                                    </div>
                                                </div>
                                                <motion.div
                                                    layout
                                                    ref={chatScroll}
                                                    className="p-3 h-full overflow-y-scroll flex flex-col gap-4"
                                                >
                                                    {msgs.map((msg, index) => (
                                                        <motion.div
                                                            layout
                                                            initial={{ x: msg.send ? 100 : -100, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ duration: 0.08 }}
                                                            className={`flex gap-2 ${msg?.user.id === user?.uid
                                                                ? "flex-row-reverse"
                                                                : ""
                                                                }`}
                                                            key={index}
                                                        >
                                                            <img
                                                                // src="https://avatars.githubusercontent.com/u/83828231"
                                                                src={msg?.user.profilePic}
                                                                alt={msg?.user.name}
                                                                className="h-8 w-8 aspect-square rounded-full object-cover"
                                                            />
                                                            <p className="bg-darkBlue1 py-2 px-3 text-xs w-auto max-w-[87%] rounded-lg border-2 border-lightGray">
                                                                {msg?.message}
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            </div> */}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    )}
                    {share && (
                        <div className="fixed flex items-center justify-center top-0 left-0 h-full w-full z-30 bg-slate-800/60 backdrop-blur">
                            <div className="bg-white  p-3 rounded shadow shadow-white w-full mx-auto max-w-[500px] relative">
                                <div className="flex items-center justify-between">
                                    <div className="text-slate-800">
                                        Share the link with someone to join the room
                                    </div>
                                    <div>
                                        <ClearIcon
                                            size={30}
                                            color="#121212"
                                            onClick={() => setShare(false)}
                                        />
                                    </div>
                                </div>
                                <div className="my-5 rounded flex items-center justify-between gap-2 text-sm text-slate-500 bg-slate-200 p-2 ">
                                    <LinkIcon />
                                    <div className="flex-grow">
                                        {window.location.href.length > 40
                                            ? `${window.location.href.slice(0, 37)}...`
                                            : window.location.href}
                                    </div>
                                    <CopyToClipboardIcon
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setTimeout(() => {
                                                navigator.clipboard.readText().then((text) => {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    // console.log(text);
                                                });
                                            }, 1000);

                                            swal({
                                                title: "Copied!",
                                                text: "Link copied to clipboard",
                                                icon: "success",
                                                button: "Ok",
                                            }).then(() => {
                                                setShare(false);
                                            });
                                        }
                                        }
                                    />
                                </div>
                                {/* <div className="flex w-full aspect-square h-full justify-center items-center">
                                    <QRCode
                                        // className="hidden"
                                        size={200}
                                        value={window.location.href}
                                        logoImage="/images/logo.png"
                                        qrStyle="dots"
                                        style={{ width: "100%" }}
                                        eyeRadius={10}
                                    />
                                </div> */}
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            )}
        </>
    );
};

export default TrackerGroupVideo;