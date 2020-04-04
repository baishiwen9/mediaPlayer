
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';

class MediaPlayer {
    initVideo(options) {
        return new VideoPlayer().init(options);
    }
    initAudio(options) {
        return new AudioPlayer().init(options);
    }
}

export default MediaPlayer;