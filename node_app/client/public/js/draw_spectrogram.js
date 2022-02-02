const drawInputSpectrogram = function (filePath){
    const wavesurfer = WaveSurfer.create({
        container: "#incomingWaveform",
        waveColor: 'violet',
        progressColor: 'purple',
        plugins: [
            WaveSurfer.spectrogram.create({
                container: "#incomingWaveform"
            })
        ]
    });

    wavesurfer.load(filePath);
    return wavesurfer;
}


const drawOutputSpectrogram = function (filePath){
    const wavesurfer = WaveSurfer.create({
        container: "#resultWaveform",
        waveColor: 'violet',
        progressColor: 'purple',
        plugins: [
            WaveSurfer.spectrogram.create({
                container: "#resultWaveform"
            })
        ]
    });

    wavesurfer.load(filePath);
    return wavesurfer;
}

