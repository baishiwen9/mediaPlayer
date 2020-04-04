MediaPlayer主要是封装原生的video和audio，让它们在不同的浏览器中尽可能的统一化。


##  1. 初始化video
可以在视频区域里手指左右滑动实现快进快退功能
可以实现横屏展示
```
    new MediaPlayer().initVideo({
        id: 'videoWrap',     //放video的标签的id
        src: 'https://v.citv.cn/v5/gongsi/乐高森林.mp4',  //视频的url
        //播放的回调
        playingCB: function() {
                console.log('---开发播放---');
        },
        <!-- 暂停的回调 -->
        pauseCB: function() {
                console.log('---暂停播放---');
        },
        <!-- 播放结束的回调 -->
        playEndCB: function() {
                console.log('---视频播放结束---')
        },
        <!-- video心跳的时间，默认为3秒 -->
        beatTime: 5,
        <!-- video播放时的心跳回调，心跳时间为beatTime -->
        playingBeatCB: function() {},
    })

```
