const drawSpectrogram = function (filePath){
    const wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: 'violet',
        progressColor: 'purple',
        plugins: [
            WaveSurfer.spectrogram.create({
                container: "#waveform"
            })
        ]
    });

    wavesurfer.load(filePath);
    return wavesurfer;
}

