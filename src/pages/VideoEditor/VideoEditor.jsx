import { useEffect, useRef, useState } from 'react';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
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

function VideoEditor() {
    const { Header, Content, Footer } = Layout;
    const device = useDeviceType();
    const agent = useUserAgent();
    const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState();
    const [videoPlayerState, setVideoPlayerState] = useState();
    const [videoPlayer, setVideoPlayer] = useState();
    const [sliderValues, setSliderValues] = useState([0, 100]);
    const [processing, setProcessing] = useState(false);
    const [show, setShow] = useState(false);
    const uploadFile = useRef('');

    useEffect(() => {
        ffmpeg.load().then(() => {
            setFFmpegLoaded(true);
        });
    }, []);

    useEffect(() => {
        const min = sliderValues[0];
        if (min !== undefined && videoPlayerState && videoPlayer) {
            videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
        }
    }, [sliderValues]);

    useEffect(() => {
        if (videoPlayer && videoPlayerState) {
            const [min, max] = sliderValues;

            const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
            const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

            if (videoPlayerState.currentTime < minTime) {
                videoPlayer.seek(minTime);
            }
            if (videoPlayerState.currentTime > maxTime) {
                videoPlayer.seek(minTime);
            }
        }
    }, [videoPlayerState]);

    useEffect(() => {
        if (!videoFile) {
            setVideoPlayerState(undefined);
            setVideoPlayer(undefined);
        }
        setSliderValues([0, 100]);
    }, [videoFile]);

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

            {device === 'mobile' ? (
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
                            <VideoPlayer
                                src={videoFile}
                                onPlayerChange={(videoPlayer) => {
                                    setVideoPlayer(videoPlayer);
                                }}
                                onChange={(videoPlayerState) => {
                                    setVideoPlayerState(videoPlayerState);
                                }}
                            />
                        ) : (
                            <>
                                <img src={video_placeholder} alt="비디오를 업로드해주세요." style={{ marginBottom: 32 }} />
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
                            </section>
                        </>
                    )}
                </article>
            ) : (
                //pc 부분
                <article style={{ padding: '56px 16px' }}>


                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h1 className={styles.title}>Video Edit</h1>

                        {videoFile && (
                            <div>
                                <input
                                    onChange={(e) => setVideoFile(e.target.files[0])}
                                    type="file"
                                    accept="video/*"
                                    height={100}
                                    style={{ display: 'center' }}
                                    ref={uploadFile}
                                />
                                <Button
                                    className={styles.re__upload__btn}
                                    onClick={() => uploadFile.current.click()}
                                    style={{
                                        width: 'fit-content',
                                        backgroundColor: 'white',
                                        color: 'Black',
                                        border: '1px solid gray'
                                    }}
                                >
                                    비디오 재선택
                                </Button>
                            </div>
                        )}
                    </div>

                    <section>
                        {videoFile ? (
                            <VideoPlayer
                                src={videoFile}
                                onPlayerChange={(videoPlayer) => {
                                    setVideoPlayer(videoPlayer);
                                }}
                                onChange={(videoPlayerState) => {
                                    setVideoPlayerState(videoPlayerState);
                                }}
                            />
                        ) : (
                            <>

                                <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                                    <img src={video_placeholder} alt="비디오를 업로드해주세요 ." style={{ marginBottom: 10 }} />
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

                            <section style={{ display: 'flex', gap: 16 }}>
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
                            </section>
                        </>
                    )}
                    {/* 끝내는 부분 */}
                    <Footer style={{ backgroundColor: '#333', color: '#fff', textAlign: 'center' }}>

                        © 2024 MyWebsite. All rights reserved.
                    </Footer>
                </article >

            )
            }
            <ToastContainer className="p-3" position={'top-center'} style={{ zIndex: 1 }}>
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
        </>

    );
}

export default VideoEditor;
