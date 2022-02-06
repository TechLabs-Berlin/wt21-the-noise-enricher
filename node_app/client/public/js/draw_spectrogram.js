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

const interval = 2000;  // 1000 = 1 second, 3000 = 3 seconds
function doAjax() {
    $.ajax({
        type: 'POST',
        url: '/generate/check-results',
        data: $(this).serialize(),
        dataType: 'json',
        success: function (data) {
            // alert('Success!')
            if (data.status === 'done') {
                // console.log('Success!');
                $("#spectrogram-output").show();
                $("#outputAudio").attr("src", "../../public/uploads/" + data.filepath);
                const resultWavesurfer = drawOutputSpectrogram("../../public/uploads/" + data.filepath);
                $("#spectrogram-loading-gif").hide();
                $("#waitingTitle").hide();
            } else {
                setTimeout(doAjax, interval);
            }
        },
        error: function (data) {
            // Schedule the next
            console.log('Fail!');
            console.log(data);
            setTimeout(doAjax, interval);
        }
    });
}
setTimeout(doAjax, interval);