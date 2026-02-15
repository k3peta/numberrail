class BgmManager {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.nextNoteTime = 0;
        this.timerID = null;
        this.tempo = 40; // ゆったりとしたテンポ
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
        this.currentNote = 0;

        // 優しいコード進行 (Cmaj7 -> Fmaj7 -> Em7 -> A7)
        this.progression = [
            [261.63, 329.63, 392.00, 493.88], // C4, E4, G4, B4
            [174.61, 261.63, 349.23, 440.00], // F3, C4, F4, A4
            [164.81, 246.94, 329.63, 392.00], // E3, B3, E4, G4
            [220.00, 277.18, 329.63, 415.30]  // A3, C#4, E4, G#4
        ];
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.15; // 音量は控えめに
            this.masterGain.connect(this.ctx.destination);
        }
    }

    play() {
        this.init();
        if (this.isPlaying) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        this.isPlaying = true;
        this.nextNoteTime = this.ctx.currentTime;
        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        if (this.timerID) clearTimeout(this.timerID);
    }

    scheduler() {
        if (!this.isPlaying) return;

        while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentNote, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }

    nextNote() {
        const secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += secondsPerBeat * 2; // 2拍ごとにコードチェンジ
        this.currentNote++;
        if (this.currentNote >= this.progression.length) {
            this.currentNote = 0;
        }
    }

    scheduleNote(beatNumber, time) {
        // アルペジオのように少しずらして鳴らす
        const chord = this.progression[beatNumber];

        chord.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle'; // 柔らかい音
            osc.frequency.value = freq;

            // エンベロープ（音の形）
            gain.gain.setValueAtTime(0, time);
            // ランダムに少しタイミングをずらして人間味を出す
            const lag = i * 0.05 + Math.random() * 0.05;
            gain.gain.linearRampToValueAtTime(0.1, time + 0.1 + lag);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 4.0 + lag); // 長いリリース

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(time + lag);
            osc.stop(time + 5.0 + lag);
        });
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
        return this.isPlaying;
    }
}

export const bgmManager = new BgmManager();
