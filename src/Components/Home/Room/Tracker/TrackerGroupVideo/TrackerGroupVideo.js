import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
// icons
// import { IoChatboxOutline as ChatIcon } from "react-icons/io5";
import { VscTriangleDown as DownIcon } from "react-icons/vsc";
import { FaUsers as UsersIcon } from "react-icons/fa";
// import { FiSend as SendIcon } from "react-icons/fi";
// import { FcGoogle as GoogleIcon } from "react-icons/fc";
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
    const {admin} = location?.state || {};

    const [micOn, setMicOn] = useState(true);
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
            config: { iceServers: [ {
                urls: "stun:openrelay.metered.ca:80",
                },
                {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject",
                },
                {
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject",
                credential: "openrelayproject",
                },
                {
                urls: "turn:openrelay.metered.ca:443?transport=tcp",
                username: "openrelayproject",
                credential: "openrelayproject",
                }] },
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

    const addPeer = useCallback((incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            config: { iceServers: [ {
                urls: "stun:openrelay.metered.ca:80",
                },
                {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject",
                },
                {
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject",
                credential: "openrelayproject",
                },
                {
                urls: "turn:openrelay.metered.ca:443?transport=tcp",
                username: "openrelayproject",
                credential: "openrelayproject",
                }] },
            stream,
        });
        peer.on("signal", (signal) => {
            socket.current.emit("returning signal", { signal, callerID,user: user?.sopnoid
                ? {
                    uid: user?.sopnoid,
                    email: user?.uemail,
                    name: user?.uname,
                    photoURL: user?.userpic,
                }
                : null, });
        });
        // joinSound.play();
        peer.signal(incomingSignal);
        return peer;
    }, [user?.sopnoid, user?.uemail, user?.uname, user?.userpic]);


    useEffect(() => {
        const unsub = () => {
            socket.current = io.connect(
                // "https://yeapbe.com:4250/"
                "http://localhost:5500/"
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
                            // console.log(users);
                            const peers = [];
                            users.forEach((user) => {
                                // console.log(user);
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
                            // alert(payload);
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
    }, [addPeer, createPeer, roomID, user?.sopnoid, user?.uemail, user?.uname, user?.userpic]);

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
                //localstream off for video 
                localStream.getVideoTracks()[0].enabled = false;
                setIsVideo(false);
                localStream.getVideoTracks()[0].stop();
                
        } else {
            localStream.getVideoTracks()[0].enabled = true;
            setIsVideo(true);
           
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


    // // Toggle Audio
    function toggleAudio() {
        setIsAudio(!isAudio);
        localStream.getAudioTracks()[0].enabled = !isAudio;
    }

    // // Hanging up the call
    const hangUp = useCallback(() => 
        {
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
            setLocalStream(null);
            setPeers([]);
            setScreenShare(false);
            setScreenTrack(null);
        }, [navigate, roomID, location.state?.room, location.state?.serviceID, localStream]
    );

    // console.log("screenShare", isVideo);
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
                                                    //flip video
                                                    className="h-full w-full object-cover rounded-lg transform scale-x-[-1]"
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
                                            {peers?.map((peer) => {
                                                console.log(peer)
                                                return (
                                                    <MeetGridCard
                                                    key={peer?.peerID}
                                                    user={peer?.user}
                                                    peer={peer?.peer}
                                                />
                                                )
                                               
})}
                                        </motion.div>
                                    </div>
                                    <div className="w-full h-16 bg-darkBlue1 border-t-2 border-lightGray p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <div>
                                                    {/* {console.log(admin)} */}
                                                    <button
                                                        className={
                                                            isAudio? "bg-orange-500 backdrop-blur border-gray border-2  p-2 cursor-pointer rounded-xl text-white text-xl" : "bg-slate-800/70 cursor-pointer backdrop-blur border-gray border-2  p-2  rounded-xl text-white text-xl"
                                                        }
                                                        // title={
                                                        //     admin ? "Mute/Unmute" : "You are not an admin"
                                                        // }
                                                        // disabled={admin ? false : true}
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
                                                        {peers?.map((user) => (
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
                                                                        user?.user?.photoURL ||
                                                                        "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
                                                                    }
                                                                    alt={user?.user?.name || "Anonymous"}
                                                                    className="block w-8 h-8 aspect-square rounded-full mr-2"
                                                                />
                                                                <span className="font-medium text-sm">
                                                                    {user?.user?.name || "Anonymous"}
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

export default React.memo(TrackerGroupVideo);