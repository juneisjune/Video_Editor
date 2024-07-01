// import { useEffect, useRef, useState } from 'react';
// import { createFFmpeg } from '@ffmpeg/ffmpeg';
// import { VideoPlayer } from './VideoPlayer';
// import VideoConversionButton from './VideoConversionButton';
// import { sliderValueToVideoTime } from '../../Utils/utils.js';

// import useDeviceType from '../../hooks/useDeviceType.jsx';
// import useUserAgent from '../../hooks/useUserAgent.jsx';

// import styles from './VideoEditor.module.css';
// import { Button, Modal, Spinner, Toast, ToastContainer } from 'react-bootstrap';

// import MultiRangeSlider from '../../components/MultiRangeSlider';
// import video_placeholder from '../../assets/images/editor/video_placeholder.png';


// import useVideoEditor from '../../hooks/useVideoEditor.jsx';
// const ffmpeg = createFFmpeg({ log: true });
// const PcEditor = () => {

//     const {
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
//     } = useVideoEditor();

//     if (!ffmpegLoaded) return <div>Loading...</div>;
//     return (


//         //pc 부분
//         <article style={{ padding: '56px 16px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                 <h1 className={styles.title}>Video Edit</h1>

//                 {videoFile && (
//                     <div>
//                         <input
//                             onChange={(e) => setVideoFile(e.target.files[0])}
//                             type="file"
//                             accept="video/*"
//                             style={{ display: 'none' }}
//                             ref={uploadFile}
//                         />
//                         <Button
//                             className={styles.re__upload__btn}
//                             onClick={() => uploadFile.current.click()}
//                             style={{ width: 'fit-content' }}
//                         >
//                             비디오 재선택(pc)
//                         </Button>
//                     </div>
//                 )}
//             </div>

//             <section>
//                 {videoFile ? (
//                     <VideoPlayer
//                         src={videoFile}
//                         onPlayerChange={(videoPlayer) => {
//                             setVideoPlayer(videoPlayer);
//                         }}
//                         onChange={(videoPlayerState) => {
//                             setVideoPlayerState(videoPlayerState);
//                         }}
//                     />
//                 ) : (
//                     <>
//                         <img src={video_placeholder} alt="비디오를 업로드해주세요." style={{ marginBottom: 32 }} />
//                         <div>
//                             <input
//                                 onChange={(e) => setVideoFile(e.target.files[0])}
//                                 type="file"
//                                 accept="video/*"
//                                 style={{ display: 'none' }}
//                                 ref={uploadFile}
//                             />
//                             <Button className={styles.upload__btn} onClick={() => uploadFile.current.click()}>
//                                 비디오 업로드하기(pc)
//                             </Button>
//                         </div>
//                     </>
//                 )}
//             </section>

//             {videoFile && (
//                 <>
//                     <section
//                         style={{
//                             width: '100%',
//                             marginTop: 30,
//                             marginBottom: 62,
//                             display: 'flex',
//                             justifyContent: 'center',
//                         }}
//                     >
//                         <MultiRangeSlider
//                             min={0}
//                             max={100}
//                             onChange={({ min, max }) => {
//                                 setSliderValues([min, max]);
//                             }}
//                         />
//                     </section>

//                     <section style={{ display: 'flex', gap: 16 }}>
//                         <VideoConversionButton
//                             onConversionStart={() => {
//                                 setProcessing(true);
//                             }}
//                             onConversionEnd={() => {
//                                 setProcessing(false);
//                                 setShow(true);
//                             }}
//                             ffmpeg={ffmpeg}
//                             videoPlayerState={videoPlayerState}
//                             sliderValues={sliderValues}
//                             videoFile={videoFile}
//                         />
//                     </section>
//                 </>
//             )}


//         </article>
//     )
// }

// export default PcEditor;