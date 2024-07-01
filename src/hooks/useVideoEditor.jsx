// import { useEffect, useState, useRef } from 'react';
// import { createFFmpeg } from '@ffmpeg/ffmpeg';

// const ffmpeg = createFFmpeg({ log: true });

// function sliderValueToVideoTime(duration, sliderValue) {
//     return (duration * sliderValue) / 100;
// }

// export function useVideoEditor() {
//     const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
//     const [videoFile, setVideoFile] = useState();
//     const [videoPlayerState, setVideoPlayerState] = useState();
//     const [videoPlayer, setVideoPlayer] = useState();
//     const [sliderValues, setSliderValues] = useState([0, 100]);
//     const [processing, setProcessing] = useState(false);
//     const [show, setShow] = useState(false);
//     const uploadFile = useRef('');

//     useEffect(() => {
//         const loadFFmpeg = async () => {
//             if (!ffmpeg.isLoaded()) {
//                 await ffmpeg.load();
//             }
//             setFFmpegLoaded(true);
//         };

//         loadFFmpeg();
//     }, []);

//     useEffect(() => {
//         const min = sliderValues[0];
//         if (min !== undefined && videoPlayerState && videoPlayer) {
//             videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
//         }
//     }, [sliderValues]);

//     useEffect(() => {
//         if (videoPlayer && videoPlayerState) {
//             const [min, max] = sliderValues;
//             const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
//             const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

//             if (videoPlayerState.currentTime < minTime) {
//                 videoPlayer.seek(minTime);
//             }
//             if (videoPlayerState.currentTime > maxTime) {
//                 videoPlayer.seek(minTime);
//             }
//         }
//     }, [videoPlayerState]);

//     useEffect(() => {
//         const savedVideoFile = localStorage.getItem('videoFile');
//         if (savedVideoFile) {
//             setVideoFile(new File([savedVideoFile], "uploadedVideo.mp4", { type: "video/mp4" }));
//         }

//         if (!videoFile) {
//             setVideoPlayerState(undefined);
//             setVideoPlayer(undefined);
//         }
//         setSliderValues([0, 100]);
//     }, [videoFile]);

//     useEffect(() => {
//         if (videoFile) {
//             const reader = new FileReader();
//             reader.onload = function (event) {
//                 localStorage.setItem('videoFile', event.target.result);
//             };
//             reader.readAsArrayBuffer(videoFile);
//         } else {
//             localStorage.removeItem('videoFile');
//         }
//     }, [videoFile]);

//     return {
//         ffmpegLoaded,
//         videoFile,
//         setVideoFile,
//         videoPlayerState,
//         setVideoPlayerState,
//         videoPlayer,
//         setVideoPlayer,
//         sliderValues,
//         setSliderValues,
//         processing,
//         setProcessing,
//         show,
//         setShow,
//         uploadFile,
//     };
// }

// export default useVideoEditor;
