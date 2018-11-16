class LyricSequence {
	constructor() {
        this.lyric = [];
        this.sequence = [];
	}

	insert(timeList, lyricLine) {
		let index = this.lyric.push(lyricLine) - 1;
		timeList.forEach((time) => {
			this.sequence.push({time: time, index: index});
		});
	}

	static compare(s1, s2) {
	    if (s1.time > s2.time)
	        return 1;
	    else if (s1.time < s2.time)
	        return -1;
	    else
	        return 0;
    }

    sort() {
	    this.sequence.sort(LyricSequence.compare);
    }

    find(currentTime) {
	    let index = -1;
	    for (let i = 0; i < this.sequence.length; i++)
	        if (currentTime >= this.sequence[i].time)
	            index = i;
	        else
                break;
	    return index;
    }
}

class MusicHandler {
	static staticConstructor() {
        this.lyricTemplate = template`
		    <div class="${1}">${0}</div>
		`;
	}

	constructor({
		lyricContainerId,
	}) {
		this.lyricContainer = document.getElementById(lyricContainerId);
	}

	init({
        lyricText,
        musicUri,
    }) {
        this.lyricText = lyricText;
        this.lyricSequence = new LyricSequence();
        this.musicUri = musicUri;
        this.activeIndex = -1;

        this.splitLyric();
        this.initLyricContainer();
        this.createInterval();
        this.createScrollListener();
    }

	splitTimeLyric(rawLyricLine) {
		let timeRegex = /\[(\d+):(\d+).(\d+)]/g;
		let timeList = [];
		let lyricLine = rawLyricLine;
		let timeLyricResult;
		do {
		    timeRegex.lastIndex = 0; // 每次检索前要把lastIndex置零 http://www.w3school.com.cn/jsref/jsref_exec_regexp.asp
			timeLyricResult = timeRegex.exec(lyricLine);
			// console.log(timeLyricResult);
			if (timeLyricResult === null)
				break;
			timeList.push(parseInt(timeLyricResult[1]) * 60 +
				parseInt(timeLyricResult[2]) +
				parseInt(timeLyricResult[3]) / 100);
            lyricLine = lyricLine.substr(timeLyricResult[0].length);
            // console.log(lyricLine);
        } while (1);
        if (timeList.length)
            this.lyricSequence.insert(timeList, lyricLine);
	}

	splitLyric() {
		let lyricLines = this.lyricText.split('\\n');
		lyricLines.forEach((lyricLine) => {
		    this.splitTimeLyric(lyricLine)
        });
		this.lyricSequence.sort();
		// console.log(this.lyricSequence);
	}

	initLyricContainer() {
        this.lyricContainer.innerHTML = `<div class="scroll-lyric-container"></div><audio autoplay loop></audio>`;
        this.scrollLyricContainer = this.lyricContainer.getElementsByClassName('scroll-lyric-container')[0];
        this.audio = this.lyricContainer.getElementsByTagName('audio')[0];
        this.audio.src = this.musicUri;

        this.lyricSequence.sequence.forEach((item) => {
	        let html = stringToHtml(
	            MusicHandler.lyricTemplate(
	                this.lyricSequence.lyric[item.index],
                    inactive,
                ));
	        this.scrollLyricContainer.appendChild(html);
        });

        this.divList = this.scrollLyricContainer.getElementsByTagName('div');
    }

    createInterval() {
	    let _this = this;
        let containerHeight = this.lyricContainer.offsetHeight;

	    setInterval(function () {
	        let currentTime = _this.audio.currentTime;
            let index = _this.lyricSequence.find(currentTime);
            if (_this.activeIndex === index)
                return;
            if (_this.activeIndex > -1)
                deactivate(_this.divList[_this.activeIndex]);
            if (index > -1)
                activate(_this.divList[index]);
            _this.activeIndex = index;

            let marginTop = containerHeight / 2 -
                _this.divList[_this.activeIndex].offsetTop +
                _this.scrollLyricContainer.offsetTop -
                _this.divList[_this.activeIndex].offsetHeight / 2;
            _this.scrollLyricContainer.style.marginTop = marginTop + 'px';
        }, 100);
    }

    createScrollListener() {
	    this.scrollLyricContainer.onscroll = function ($event) {
            console.log($event);
        }
    }
}

MusicHandler.staticConstructor();
