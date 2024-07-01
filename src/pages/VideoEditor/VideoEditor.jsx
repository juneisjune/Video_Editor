import { useEffect, useRef, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

import { VideoPlayer } from './VideoPlayer';
import VideoConversionButton from './VideoConversionButton';
import { sliderValueToVideoTime } from '../../Utils/utils.js';

import useDeviceType from '../../hooks/useDeviceType.jsx';
import useUserAgent from '../../hooks/useUserAgent.jsx';

import styles from './VideoEditor.module.css';
import { Button, Modal, Spinner, Toast, ToastContainer } from 'react-bootstrap';

import { Layout } from 'antd';

import MultiRangeSlider from '../../components/MultiRangeSlider';
import video_placeholder from '../../assets/images/editor/video_placeholder.png';
import logo from '../../assets/icons/ffmpeg.png';

const ffmpeg = createFFmpeg({ log: true });
const { Footer } = Layout;

function VideoEditor() {
    const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState();
    const [videoPlayerState, setVideoPlayerState] = useState();
    const [videoPlayer, setVideoPlayer] = useState();
    const [sliderValues, setSliderValues] = useState([0, 100]);
    const [processing, setProcessing] = useState(false);
    const [show, setShow] = useState(false);
    const uploadFile = useRef('');

    const [currentTime, setCurrentTime] = useState(0);
    const [videoElement, setVideoElement] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);

    const sliderValueToVideoTime = (duration, value) => {
        return (duration * value) / 100;
    };

    useEffect(() => {
        // loading ffmpeg on startup
        ffmpeg.load().then(() => {
            setFFmpegLoaded(true);
        });
    }, []);

    useEffect(() => {
        const min = sliderValues[0];
        // when the slider values are updated, updating the video time
        if (min !== undefined && videoPlayerState && videoPlayer) {
            videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
        }
    }, [sliderValues]);

    useEffect(() => {
        if (videoPlayer && videoPlayerState) {
            // allowing users to watch only the portion of the video selected by the slider
            const [min, max] = sliderValues;

            const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
            const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

            if (videoPlayerState.currentTime < minTime) {
                videoPlayer.seek(minTime);
            }
            if (videoPlayerState.currentTime > maxTime) {
                // looping logic
                videoPlayer.seek(minTime);
            }
        }
    }, [videoPlayerState]);

    useEffect(() => {
        // when the current videoFile is removed, restoring the default state
        if (!videoFile) {
            setVideoPlayerState(undefined);
            setVideoPlayer(undefined);
        }
        setSliderValues([0, 100]);
    }, [videoFile]);

    // 재생 시간 추가
    useEffect(() => {
        const fetchVideoDuration = async () => {
            if (videoFile) {
                if (!ffmpeg.isLoaded()) {
                    await ffmpeg.load();
                }
                ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
                await ffmpeg.run('-i', 'input.mp4');
                const data = ffmpeg.FS('readFile', 'input.mp4');
                const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
                const video = document.createElement('video');
                video.src = URL.createObjectURL(videoBlob);

                video.addEventListener('loadedmetadata', () => {
                    setVideoDuration(video.duration);
                });

                video.addEventListener('timeupdate', () => {
                    setCurrentTime(video.currentTime);
                });

                setVideoElement(video); // 비디오 요소 설정
            }
        };

        fetchVideoDuration();
    }, [videoFile]);

    // 재생 시간 화면 같이
    useEffect(() => {
        if (videoElement) {
            const [min, max] = sliderValues;

            const minTime = sliderValueToVideoTime(videoDuration, min);
            const maxTime = sliderValueToVideoTime(videoDuration, max);

            videoElement.currentTime = minTime;

            const handleTimeUpdate = () => {
                if (videoElement.currentTime > maxTime) {
                    videoElement.currentTime = minTime;
                }
            };

            videoElement.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [sliderValues, videoElement, videoDuration]);

    const extractAudio = async () => {
        if (!videoFile) return;

        setProcessing(true);

        // Load FFmpeg if not already loaded
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }

        // Write the video file to the FFmpeg file system
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

        // Calculate start time and duration based on slider values
        const [min, max] = sliderValues;
        const minTime = sliderValueToVideoTime(videoDuration, min);
        const maxTime = sliderValueToVideoTime(videoDuration, max);
        const duration = maxTime - minTime;

        // Run the FFmpeg command to extract audio for the selected segment and save as MP3
        await ffmpeg.run('-i', 'input.mp4', '-ss', `${minTime}`, '-t', `${duration}`, '-q:a', '0', '-map', 'a', 'output.mp3');

        // Read the result and create a blob
        const data = ffmpeg.FS('readFile', 'output.mp3');
        const mp3Blob = new Blob([data.buffer], { type: 'audio/mp3' });

        // Create a download link for the MP3 file
        const url = URL.createObjectURL(mp3Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audio.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setProcessing(false);
        setShow(true);
    };


    if (!ffmpegLoaded) return <div>Loading...</div>;

    return (
        <>
            <header style={{ padding: '10px 100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="logo" style={{ width: 40 }} />
                    <h1 style={{ margin: 0, marginLeft: 10 }}>VE</h1>
                </div>
                <nav style={{ display: 'flex', gap: '20px' }}>
                    <Button style={{ position: 'relative', paddingBottom: '10px', backgroundColor: 'white', color: 'Black', border: 'none', fontWeight: 'bold' }}>
                        비디오 편집
                    </Button>
                    <Button style={{ position: 'relative', paddingBottom: '10px', backgroundColor: 'white', color: 'Black', border: 'none' }}>
                        이미지 편집
                    </Button>
                    <Button style={{ position: 'relative', paddingBottom: '10px', backgroundColor: 'white', color: 'Black', border: 'none' }}>
                        로그인
                    </Button>
                </nav>
            </header>
            <article className="layout" style={{ padding: '56px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h1 className={styles.title}>Video Edit</h1>

                    {videoFile && (
                        <div>
                            <input
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                type="file"
                                accept="video/*"
                                style={{ display: 'none' }}
                                ref={uploadFile}
                            />
                            <Button
                                className={styles.re__upload__btn}
                                onClick={() => uploadFile.current.click()}
                                style={{ width: 'fit-content' }}
                            >
                                비디오 재선택
                            </Button>
                        </div>
                    )}
                </div>

                <section>
                    {videoFile ? (
                        <div>
                            <video
                                controls
                                width="600"
                                ref={(el) => {
                                    if (el && videoElement && el.src !== videoElement.src) {
                                        el.src = videoElement.src;
                                    }
                                    setVideoElement(el);
                                }}
                            >
                                Your browser does not support the video tag.
                            </video>
                            <div style={{ display: 'none' }}>
                                <VideoPlayer
                                    src={videoFile}
                                    onPlayerChange={(videoPlayer) => {
                                        setVideoPlayer(videoPlayer);
                                    }}
                                    onChange={(videoPlayerState) => {
                                        setVideoPlayerState(videoPlayerState);
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                                <img src={video_placeholder} alt="비디오를 업로드해주세요" style={{ marginBottom: '32px', maxWidth: '80%', maxHeight: '80%' }} />
                            </div>
                            <div>
                                <input
                                    onChange={(e) => setVideoFile(e.target.files[0])}
                                    type="file"
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    ref={uploadFile}
                                />
                                <Button className={styles.upload__btn} onClick={() => uploadFile.current.click()}>
                                    비디오 업로드하기
                                </Button>
                            </div>
                        </>
                    )}
                </section>

                {videoFile && (
                    <>


                        <section
                            style={{
                                width: '100%',
                                marginTop: 30,
                                marginBottom: 62,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <MultiRangeSlider
                                min={0}
                                max={100}
                                onChange={({ min, max }) => {
                                    setSliderValues([min, max]);
                                }}
                            />
                        </section>

                        <section>
                            <VideoConversionButton
                                onConversionStart={() => {
                                    setProcessing(true);
                                }}
                                onConversionEnd={() => {
                                    setProcessing(false);
                                    setShow(true);
                                }}
                                ffmpeg={ffmpeg}
                                videoPlayerState={videoPlayerState}
                                sliderValues={sliderValues}
                                videoFile={videoFile}
                            />
                            <Button
                                onClick={extractAudio}
                                style={{ marginTop: '20px' }}
                            >
                                오디오 추출하기
                            </Button>
                        </section>

                    </>
                )}

                <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
                    <Toast onClose={() => setShow(false)} show={show} delay={2000} bg="dark" autohide>
                        <Toast.Header closeButton={false}>
                            <strong className="me-auto">Video Editor</strong>
                        </Toast.Header>
                        <Toast.Body>내보내기가 완료되었습니다.</Toast.Body>
                    </Toast>
                </ToastContainer>

                <Modal
                    show={processing}
                    onHide={() => setProcessing(false)}
                    backdrop={false}
                    keyboard={false}
                    centered
                    size="sm"
                >
                    <div style={{ textAlign: 'center' }}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>

                        <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: '#c8c8c8' }}>
                            내보내기가 진행중입니다.
                        </p>
                    </div>
                </Modal>
            </article>
            <Footer style={{ backgroundColor: '#4a4a4a', color: '#fff', padding: '20px' }}>
                <div>
                    <div className="footer-left">
                        <img src={logo} alt="logo" style={{ width: 40 }} />
                        <nav style={{ display: 'flex', gap: '20px' }}>
                            <Button style={{ position: 'relative', paddingBottom: '10px', backgroundColor: 'white', color: 'Black', border: 'none', fontWeight: 'bold' }}>
                                비디오 편집
                            </Button>
                            <Button style={{ position: 'relative', paddingBottom: '10px', backgroundColor: 'white', color: 'Black', border: 'none' }}>
                                이미지 편집
                            </Button>
                            <Button style={{ position: 'relative', paddingBottom: '10px', backgroundColor: 'white', color: 'Black', border: 'none' }}>
                                로그인
                            </Button>
                        </nav>
                        <div className="contact-info">
                            <p>Tel. 02-2023-2024</p>
                            <p>E-mail: iedong@naver.com</p>
                        </div>
                    </div>
                </div>
            </Footer>
        </>
    );
}

export default VideoEditor;
