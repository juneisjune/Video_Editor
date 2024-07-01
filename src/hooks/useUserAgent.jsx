import React from 'react';

const useUserAgent = () => {
    let userAgent = navigator.userAgent;

    return userAgent;
}

export default useUserAgent;