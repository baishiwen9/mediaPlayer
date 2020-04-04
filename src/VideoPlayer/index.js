import './index.css';
import Utils from './../Utils/index';


class VideoPlayer {
    constructor() {
        this.MobileOS = Utils.getMobileOS();
        this.state = {
            width: '100%',
            height: '210px',
            controls: true,
            id: '',
            videoClass: this.MobileOS === 'iOS' ? 'vd-ready' : 'vd-preparing',
            playBtn: '',
            src: '',
            poster: '',
            loop: false,
            autoPlay: false,
            duration: 0,
            currentTime: 0,
            playing: false,
            beatTime: 3,
            showLoading: true,
        };
        this.videoPlayer = null;
    }

    init(options) {
        const isObj = Utils.isObj(options);
        if (!isObj) {
            throw new Error('请传入有效的对象参数');
        }
        this.setState(options);
        this.render();
        setTimeout(() => {
            const { showLoading } = this.state;
            if (showLoading) {
                this.hideLoading();
            }
        }, 6000);
        return this.videoPlayer;
    }
    setState(options, cb) {
        const isObj = Utils.isObj(options);
        if (isObj) {
            this.state = Object.assign(this.state, options);
            cb && typeof cb === 'function' && cb();
        }
    }
    render() {
        const { 
            id, src, height, width, videoClass, loop,
            poster, autoPlay, controls, showLoading,
        } = this.state;
        const wrapper = this.getElementById(id);
        const videoHtml = `
            <div class="media-VideoWrap video-player" style="width: ${width}; height: ${height}">
                <video 
                    id="media-VideoPlayer" 
                    width="${width}" 
                    height="${height}" 
                    x5-video-orientation="portraint" 
                    x5-video-player-type="h5" 
                    x5-video-player-fullscreen="true" 
                    class="${videoClass}" 
                    preload="auto"
                    x-webkit-airplay="true" 
                    webkit-playsinline="true" 
                    playsinline="true" 
                    poster="${Utils.replaceProtocol(poster)}"
                >
                    <source src="${Utils.replaceProtocol(src)}">
                </video>
                ${ controls ? this.renderControls() : ''}
                ${ showLoading ? this.renderLoading() : ''}
                ${ this.renderTimeTip() }
                ${ this.renderFullScreenHeader() }
            </div>`;
        
        wrapper.innerHTML = videoHtml;
        this.videoPlayer = this.getElementById('media-VideoPlayer');
        if (autoPlay) {
            this.videoPlayer.setAttribute('autoplay', 'autoplay');
            this.videoPlayer.play();
            this.setState({
                playing: true,
            }, () => {
                this.setVideoPlayStatus(true);
            });
        }
        if (loop) {
            this.videoPlayer.setAttribute('loop', 'loop');
        }
        
        this.bindEvent();
        this.timerid = setTimeout(() => {
            this.hideControls();
        }, 5000);
    }

    //渲染控制条
    renderControls() {
        const { duration, currentTime } = this.state;
        this.bindEventOfControls(currentTime, duration);
        return (
            `<div class="video-controls show" id="controlsBar">
                <div id="videoHandler" class="video-playBtn iconfont icon-play"></div>
                <div class="progressBar-wrap">
                    <div class="curTime">${currentTime === 0 ? '00:00' : currentTime}</div>
                    <div class="progressBar">
                        <div class="bar"></div>
                        <div class="slider"></div>
                    </div>
                    <div class="allTime">${duration === 0 ? '00:00' : duration}</div>
                </div>
                <div class="fullScreenBtn show" id="fullscreenBtn"></div>
            </div>`
        );
    }

    getControlsEle() {
        return this.getElementByClass('video-controls');
    }

    hideControls() {
        const controlsEle = this.getControlsEle();
        controlsEle.classList.remove('show');
        controlsEle.classList.add('hide');
    }

    showControls(status) {
        if (this.timerid) {
            clearTimeout(this.timerid);
        }
        const controlsEle = this.getControlsEle();
        controlsEle.classList.remove('hide');
        controlsEle.classList.add('show');
        if (!status) {
            this.timerid = setTimeout(() => {
                this.hideControls();
            }, 5000);
        }
    }

    //渲染手指滑动时候的时间提示
    renderTimeTip() {
        return (
            `<div class="timeTip_wrap hide">
                <span class="timeTip_currentTime"></span>/
                <span class="timeTip_duration"></span>
            </div>`
        );
    }

    getTimeTipEle() {
        return this.getElementByClass('timeTip_wrap');
    }

    showTimeTip() {
        const timeTipEle = this.getTimeTipEle();
        timeTipEle.classList.remove('hide');
        timeTipEle.classList.add('show');
    }

    hideTimeTip() {
        const timeTipEle = this.getTimeTipEle();
        timeTipEle.classList.remove('show');
        timeTipEle.classList.add('hide');
    }

    setTimeTipValue(curTime, duration) {
        const curTimeDom = this.getElementByClass('timeTip_currentTime');
        const durationDom = this.getElementByClass('timeTip_duration');
        this.setInnerHtml(curTimeDom, curTime);
        this.setInnerHtml(durationDom, duration);
    }

    //渲染loading
    renderLoading() {
        return (
            `<div class="loading-wrap show" id="media-VideoLoading">
                <div class="loading-icon"></div>
            </div>`
        );
    }

    getLoadingEle() {
        return this.getElementById('media-VideoLoading');
    }

    showLoading() {
        const loading = this.getLoadingEle();
        loading.classList.remove('hide');
        loading.classList.add('show');
    }
    
    hideLoading() {
        const loading = this.getLoadingEle();
        loading.classList.remove('show');
        loading.classList.add('hide');
    }

    getElementById(id) {
        return this.getElement(id, 'id');
    }

    getElementByClass(cls) {
        return this.getElement(cls, 'class');
    }
    //获取元素
    getElement(selector, type) {
        if (selector === '' || !selector) {
            return document.body;
        }
        let node = type === 'id' ? document.getElementById(selector) : document.querySelector(`.${selector}`);
        if (!node) {
            return document.body;
        }
        return node;
    }

    bindEvent() {
        if (this.videoPlayer) {
            const videoPlayer = this.videoPlayer;
            // 播放时间发生改变
            videoPlayer.addEventListener('timeupdate', (e) => {
                const currentTime = e.target.currentTime;
                this.setState({
                    currentTime,
                }, () => {
                    const node = this.getElementByClass('curTime');
                    this.setInnerHtml(node, currentTime);
                });

                if (!this.state.duration || this.state.duration === '00:00') {
                    const duration = e.target.duration;
                    this.setState({
                        duration,
                    }, () => {
                        const node = this.getElementByClass('allTime');
                        this.setInnerHtml(node, duration);
                    });
                }

                this.getProgressbarWidth(e.target.currentTime, e.target.duration);

                // 视频每播放一定的时间后进行心跳检测回调
                const { playing, playingBeatCB, beatTime } = this.state;
                if (!this.startTime) {
                    this.startTime = new Date().getTime();
                } else {
                    const diffTime = new Date().getTime() - this.startTime;
                    if (diffTime / 1000 >= beatTime) {
                        this.startTime = new Date().getTime();
                        window.console.log(`---视频播放了${beatTime}秒了---`);
                        if (playing) {
                            Utils.isFunction(playingBeatCB) && playingBeatCB(e.target.currentTime);
                        }
                    }
                }
                this.setState({
                    showLoading: false,
                }, () => {
                    this.hideLoading();
                });
            });

            const { playEndCB } = this.state;
            //播放结束
            videoPlayer.addEventListener('ended', () => {
                this.setVideoPlayStatus(false);
                Utils.isFunction(playEndCB) && playEndCB();
            }, false);

            //视频是否可以播放
            videoPlayer.addEventListener('canplaythrough', () => {
                window.console.log('视频可以正常播放了');
                this.setState({
                    showLoading: false,
                }, () => {
                    this.hideLoading();
                });
            }, false);
            
            //点击
            videoPlayer.addEventListener('click', (e) => {
                Utils.stopPropagation(e);
                if (e.target.id === "media-VideoPlayer") {
                    this.showControls();
                }
            },false);

            //等待中...
            videoPlayer.addEventListener('waiting', () => {
                this.setState({
                    showLoading: true,
                }, () => {
                    this.showLoading();
                });
            },false);

            videoPlayer.addEventListener('touchstart', (e) => {
                Utils.stopPropagation(e);
                const { isFullscreen } = this.state;
                this.startX = isFullscreen ? e.touches[0].clientY : e.touches[0].clientX;
                window.console.log('滑动开始');
                this.showControls('moveStart');
                const progressBar = this.getElementByClass('progressBar');
                this.progressBarWidth = progressBar && progressBar.offsetWidth;
            }, false);

            videoPlayer.addEventListener('touchmove', (e) => {
                Utils.stopPropagation(e);
                this.showTimeTip();
                const { isFullscreen } = this.state;
                const curX = isFullscreen ? e.touches[0].clientY : e.touches[0].clientX;
                window.console.log('滑动中');
                let diffX = curX - this.startX;
                
                const { duration, currentTime } = this.state;
                const rate = ((diffX * this.progressBarWidth) / duration) / 1000;
                let result = rate + currentTime;
                result = result < 0 ? 0 : result;
                result = result > duration ? duration : result;
                videoPlayer.currentTime = result;
                this.setState({
                    currentTime: result,
                }, () => {
                    this.setCurrentTime(result);
                    this.getProgressbarWidth(result, duration);
                    this.setTimeTipValue(result, duration);
                });
            }, { passive: false });

            videoPlayer.addEventListener('touchend', (e) => {
                Utils.stopPropagation(e);
                window.console.log('滑动结束');
                this.startX = 0;
                this.timerid = setTimeout(() => {
                    this.hideControls();
                }, 5000);
                this.hideTimeTip();
            }, false);

            videoPlayer.addEventListener('play', () => {
                this.setVideoPlayStatus(true);
                const { playingCB } = this.state;
                Utils.isFunction(playingCB) && playingCB();
            });

            videoPlayer.addEventListener('error', (e) => {
                window.console.log('加载视频数据时遇到错误', e);
            });

            videoPlayer.addEventListener('pause', () => {
                this.startTime = 0;
                this.setVideoPlayStatus(false);
                const { pauseCB } = this.state;
                Utils.isFunction(pauseCB) && pauseCB();
            });

            videoPlayer.addEventListener('loadedmetadata', (res)=> {
                const duration = res.target.duration;
                this.setState({
                    duration,
                }, () => {
                    const node = this.getElementByClass('allTime');
                    this.setInnerHtml(node, duration);
                });
            }, false);
        }
    }

    bindEventOfControls() {
        // 点击控制条的播放暂停按钮
        const playBtn = this.getElementByClass('video-playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                Utils.stopPropagation(e);
                if (e.target.id === 'videoHandler') {
                    const { playing } = this.state;
                    if (!playing) {
                        this.videoPlayer && this.videoPlayer.play();
                    } else {
                        this.videoPlayer && this.videoPlayer.pause();
                    }
                }
            }, false);
        }
        //点击全屏按钮
        const fullScreenBtn = this.getElementByClass('fullScreenBtn');
        if (fullScreenBtn) {
            fullScreenBtn.addEventListener('click', (e) => {
                Utils.stopPropagation(e);
                if (e.target.id === 'fullscreenBtn') {
                    this.fullScreen();
                    const { playing } = this.state;
                    playing && this.videoPlayer.play();
                    const { currentTime, duration } = this.state;
                    this.getProgressbarWidth(currentTime, duration);
                }
            }, false);
        }
        //点击进度条
        const controlsBar = this.getElementByClass('progressBar-wrap');
        if (controlsBar) {
            controlsBar.addEventListener('click', (e) => {
                Utils.stopPropagation(e);
                // Utils.preventDefault(e);
                if ((e.target.id === 'controlsBar') || e.target.classList.value && e.target.classList.value.indexOf('progressBar') !== -1) {
                    const { duration, isFullscreen } = this.state;
                    const progressBar = this.getElementByClass('progressBar');
                    const barLeft = progressBar.offsetLeft;
                    const barWidth = progressBar.offsetWidth;
                    const start_X = barLeft;
                    const end_X = start_X + barWidth;
                    const clientX = isFullscreen ? e.clientY : e.clientX;
                    if (clientX >= end_X || clientX <= start_X) {
                        return;
                    } else {
                        const gap = ((clientX - start_X) * duration) / barWidth;
                        window.console.log('点击了', gap);
                        this.playTo(gap);
                    }
                }
            }, false);
        }
    }
    // 设置video当前的播放状态
    setVideoPlayStatus(status) {
        this.setState({
            playing: status,
        });
        this.updatePlayIcon(status);
    }
    // 给指定的dom元素设置值
    setInnerHtml(node, value) {
        if (node) {
            node.innerHTML = Utils.formatTime(value);
        }
    }
    // 给进度条和滑块设置样式
    getProgressbarWidth(currentTime, duration) {
        const width = (currentTime * 1 / duration * 1) * 100 + '%';
        const barNode = this.getElementByClass('bar');
        const slider = this.getElementByClass('slider');
        barNode.style.width = width;
        slider.style.left = width;
    }
    // 更新控制条上的播放和暂停按钮图标
    updatePlayIcon(status) {
        const playBtn = this.getElementByClass('video-playBtn');
        if (!status) {
            playBtn.classList.remove('icon-pause');
            playBtn.classList.add('icon-play');
        } else {
            playBtn.classList.remove('icon-play');
            playBtn.classList.add('icon-pause');
        }
    }

    //进入全屏
    fullScreen() {
        this.setState({
            isFullscreen: true,
        });
        this.showFullscreenHeader();
        window.addEventListener('touchmove', Utils.preventDefault, { passive: false });
        const videoWrap = this.getElementByClass('media-VideoWrap');
        
        const w = document.documentElement.clientWidth || document.body.clientWidth;
        const h = document.documentElement.clientHeight || document.body.clientHeigth;
        const gap = (Math.abs(h - w) / 2) + 'px';

        videoWrap.style.width = h + 'px';
        videoWrap.style.height = w + 'px';
        
        videoWrap.style.transform = `rotate(90deg) translate(${gap},${gap})`;
        videoWrap.style.webkitTransform = `rotate(90deg) translate(${gap},${gap})`;
        videoWrap.style.msTransform = `rotate(90deg) translate(${gap},${gap})`;
        
        const videoEle = this.videoPlayer;
        videoEle.classList.add('rotate');
        videoEle.width = h;
        videoEle.height = w;
        this.hideFullScreenBtn();
        const { fullScreenCB } = this.state;
        Utils.isFunction(fullScreenCB) && fullScreenCB();
        this.bindExitFullscreenEvent();
    }

    //退出全屏
    exitFullscreen() {
        const { exitFullScreenCB, height, isFullscreen } = this.state;
        if (!isFullscreen) {
            return;
        }

        this.setState({
            isFullscreen: false,
        });
        this.showFullscreenBtn();
        this.hideFullScreenHeader();
        
        Utils.isFunction(exitFullScreenCB) && exitFullScreenCB();
        window.removeEventListener('touchmove', Utils.preventDefault);
        const videoWrap = this.getElementByClass('media-VideoWrap');
        videoWrap.style.width = '100%';
        videoWrap.style.height = height;
        videoWrap.style.transform = `rotate(360deg)`;
        videoWrap.style.webkitTransform = `rotate(360deg)`;
        videoWrap.style.msTransform = `rotate(360deg)`;
        
        const videoEle = this.videoPlayer;
        videoEle.classList.remove('rotate');
        videoEle.width = window.innerWidth;
        videoEle.height = parseInt(height);
    }
    // 获取控制条上的全屏按钮
    getFullscreenBtnEle() {
        return this.getElementById('fullscreenBtn');
    }
    // 显示控制条上的全屏按钮
    showFullscreenBtn() {
        const fullscreenBtnEle = this.getFullscreenBtnEle();
        fullscreenBtnEle.classList.remove('hide');
        fullscreenBtnEle.classList.add('show');
    }
    // 全屏的时隐藏控制条上的全屏按钮
    hideFullScreenBtn() {
        const fullscreenBtnEle = this.getFullscreenBtnEle();
        fullscreenBtnEle.classList.remove('show');
        fullscreenBtnEle.classList.add('hide');
    }
    // 渲染全屏的时候头部
    renderFullScreenHeader() {
        return (
            `
            <div class="fullScreen-header hide">
                <div id="fullScreen-header-backBtn" class="fullScreen-header-backBtn iconfont icon-back"></div>
                <div class="fullScreen-header-title">${document.title}</div>
            </div>
            `
        );
    }
    //在全屏的时候显示头部
    showFullscreenHeader() {
        const fullScreenHeader = this.getElementByClass('fullScreen-header');
        fullScreenHeader.classList.remove('hide');
        fullScreenHeader.classList.add('show');
    }
    //隐藏全屏的时候出现的头部
    hideFullScreenHeader() {
        const fullScreenHeader = this.getElementByClass('fullScreen-header');
        fullScreenHeader.classList.remove('show');
        fullScreenHeader.classList.add('hide');
    }
    //绑定退出全屏事件
    bindExitFullscreenEvent() {
        const exitFullScreenBtn = this.getElementById('fullScreen-header-backBtn');
        if (exitFullScreenBtn) {
            exitFullScreenBtn.addEventListener('click', (e) => {
                Utils.stopPropagation(e);
                if (e.target.id === 'fullScreen-header-backBtn') {
                    this.exitFullscreen();
                    const { currentTime, duration } = this.state;
                    this.getProgressbarWidth(currentTime, duration);
                }
            }, false);
        }
    }
    //让视频播放到指定的时间
    playTo(curTime) {
        this.videoPlayer.currentTime = curTime;
        this.setCurrentTime(curTime);
        this.getProgressbarWidth(curTime, this.state.duration);
    }
    //设置当前播放的时间
    setCurrentTime(curTime) {
        const curTimeDom = this.getElementByClass('timeTip_currentTime');
        this.setInnerHtml(curTimeDom, curTime);
    }
}

export default VideoPlayer;