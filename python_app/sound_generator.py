from enricher_models import VAE
from input_preprocessing import preprocessor
import numpy as np
import soundfile as sf
import librosa

model = VAE.load('Test_SoundGeneratorVAE_V2/model')

def create_sound(input_array, minmax_dict):
    print(input_array.shape, minmax_dict)
    generated, latent = model.reconstruct(input_array)

    signals = []
    for spec, minmax in zip(generated, minmax_dict):
        log_spec = spec[:, :, 0]

        # normalize between 0, 1
        log_spec_norm = (log_spec - np.min(log_spec)) / (np.max(log_spec) - np.min(log_spec))

        # denormalize with original min max values
        log_spec_denorm = log_spec_norm * (minmax['max'] - minmax['min']) + minmax['min']

        # create spectrogram
        spec = librosa.db_to_amplitude(log_spec_denorm)

        signal = librosa.istft(spec, hop_length=259)
        signals.append(signal)

    for i, signal in enumerate(signals):
        sf.write(f'temp_audio_files/reconstructed{i}.wav', signal, samplerate=22050)


if __name__=='__main__':
    path_to_input_file = '/home/christian/Documents/sound_classifier/test_sounds/witchfucker.wav'
    preprocess = preprocessor(path_to_input_file)

    input_arrays, minmax = preprocess.to_encoder()

    create_sound(input_arrays, minmax)