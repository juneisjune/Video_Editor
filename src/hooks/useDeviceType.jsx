import React, { useState, useLayoutEffect } from 'react';

const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState('pc');

    let screenWidth = window.innerWidth;

    const updateDeviceType = () => {
        screenWidth = window.innerWidth;

        if (screenWidth <= 768) {
            setDeviceType('mobile');
            console.log('mobile');

        }
        if (screenWidth > 768 && screenWidth <= 1024) {
            setDeviceType('tablet');
            console.log('tablet');

        }
        if (screenWidth > 1024) {
            setDeviceType('pc');
            console.log('pc');
        }
    };

    useLayoutEffect(() => {
        updateDeviceType();
        window.addEventListener('resize', updateDeviceType);

        return () => {
            window.removeEventListener('resize', updateDeviceType);
        }
    }, [deviceType])

    return deviceType
}

export default useDeviceType;