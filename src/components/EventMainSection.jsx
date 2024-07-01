import React from 'react';
import styles from '../pages/EventByBootstrap.module.css';


import event_thumb from '../assets/images/evnet_thumb.png';
import star from '../assets/icons/star.svg';

const EventMainSection = () => {
    return (
        <section>
            <img src={event_thumb} alt="이벤트 이미지1" className={styles.event__img} />
            <div className={styles.percent__section}>
                <div className={styles.percent}>
                    <img src={star} alt="star" className={styles.event__img} />
                    <h2>50% </h2>
                </div>
                <h3>
                    고객 여러분들을 위해 다양한
                    <br />
                    <span>최대 50%</span> 할인 상품들을 준비했어요
                    <br /> 이 기회를 놓치지 마세요!
                </h3>

            </div>
        </section>
    )
}

export default EventMainSection;