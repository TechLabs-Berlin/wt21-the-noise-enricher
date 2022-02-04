const drawInputSpectrogram = function (filePath){
    const wavesurfer = WaveSurfer.create({
        container: "#incomingWaveform",
        waveColor: 'violet',
        progressColor: 'purple',
        plugins: [
            WaveSurfer.spectrogram.create({
                container: "#incomingSpectrogram",
                labels: false
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
                container: "#resultSpectrogram",
                labels: false
            })
        ]
    });

    wavesurfer.load(filePath);
    return wavesurfer;
}

