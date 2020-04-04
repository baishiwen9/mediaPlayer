//辅助工具
const Utils = {
    getMobileOS() {
        const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return 'Windows Phone';
        }
        if (/android/i.test(userAgent)) {
            return 'Android';
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'iOS';
        }
        return 'unknown';
    },
    getProtocol() {
        let curProtocol = window.location.protocol;
        if (curProtocol === 'file:') {
            curProtocol = "https:";
        }
        return curProtocol;
    },
    replaceProtocol(url) {
        const curProtocol = Utils.getProtocol();
        if (url) {
            return url.replace(/(https:)|(http:)/ig, curProtocol);
        }
        return '';
    },
    isObj(opt) {
        if (opt && Object.prototype.toString.call(opt) === '[object Object]') {
            return true;
        }
        return false;
    },
    formatTime(time) {
        if (!time) {
            return '00:00';
        }
        let minute = '';
        let second = '';
        minute = Math.floor(time * 1 / 60) + '';
        second = (((time * 1) % 60) + '').split('.')[0];
        minute = (minute.length === 1) ? '0' + minute : minute;
        second = (second.length === 1) ? '0' + second : second;
        return minute + ':' + second;
    },
    stopPropagation(e) {  
        e = e || window.event;  
        if(e.stopPropagation) { 
            e.stopPropagation();  
        } else {  
            e.cancelBubble = true;
        }
    },
    preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    },
    isFunction(fn) {
        if (fn && typeof fn === 'function') {
            return true;
        }
        return false;
    },
    //节流函数
    throttle(func, delay) {
        window.console.log('throttle', this);
        let timer = null;
        return function() {
            if (!timer) {
                timer = setTimeout(function() {
                    func(arguments);
                    timer = null;
                }, delay);
            }
        }
    },
}



export default Utils;