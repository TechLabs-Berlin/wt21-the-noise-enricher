import numpy as np
import librosa
import os
import glob
from pydub import AudioSegment
try:
    import torchaudio
    import torch
except:
    pass

class preprocessor:
    def __init__(self, filepath, path_to_save=None, unique_id='some_unique_id'):
        if not path_to_save:
            upload = "temp_audio_files/"
        else:
            upload = path_to_save


        input_audio = AudioSegment.from_wav(filepath)

        # transformation to mono, downsampling
        input_audio = input_audio.set_channels(1)
        input_audio = input_audio.set_frame_rate(22050)

        # splitting into chunks of 3 seconds for processing in NN
        n_chunks = len(input_audio)//3000

        for i in range(n_chunks):
            input_audio[(i*3000): ((i+1)*3000)].export(
                f'{upload}file_{unique_id}_{i}.wav', format='wav')
            
        self.audio_chunks = glob.glob(f'{upload}file_{unique_id}*.wav')

    def to_classifier(self):
        # classifier needs tensor size [2, 258, 258] with [0, :] real and [1, :] imaginary part of
        # complex tensor derived from torch.transforms.Spectrogram

        spectrograms = []
        
        for file in self.audio_chunks:
            wf, _ = torchaudio.load(file)
            spec = torchaudio.transforms.Spectrogram(n_fft=515, power=None, return_complex=True)(wf)
            spectrograms.append(spec)

        # create empty complex tensor and fill it with spectrograms of input audio
        input_tensor = torch.empty((len(spectrograms), 2, 258, 258), dtype=torch.float32)

        # fill tensor with spectrograms of input audio
        for i, s in enumerate(spectrograms): 
            input_tensor[i, 0] = s.real
            input_tensor[i, 1] = s.imag

        return input_tensor


    def to_encoder(self):
        # autoencoder needs numpy arrays with dimension [batchsize, 256, 256, 1]
        input_array = np.empty((len(self.audio_chunks), 256, 256, 1))
        minmax_values = []

        # creating numpy arrays spectrograms from audio chunks
        for i, chunk in enumerate(self.audio_chunks):
            # signal processing to normalized log-transformed spectrogram
            signal = librosa.load(chunk, sr=22050, duration=3, mono=True)[0]
            stft = librosa.stft(signal, n_fft=512, hop_length=259)[:-1]
            spectrogram = np.abs(stft)
            log_spectrogram = librosa.amplitude_to_db(spectrogram)
            min_val, max_val = np.min(log_spectrogram), np.max(log_spectrogram)
            norm_spectrogram = (log_spectrogram - min_val) / (max_val - min_val)

            # min max values for reconstruction later
            minmax_values.append({'min': min_val, 'max': max_val})

            input_array[i, :, :, 0] = norm_spectrogram
        
        return input_array, minmax_values


    def _delete_audio_chunks(self):
        for file in self.audio_chunks:
            os.remove(file)


if __name__=='__main__':
    path_to_input_file = '/home/christian/Documents/sound_classifier/test_sounds/witchfucker.wav'
    preprocess = preprocessor(path_to_input_file)
    
    c = preprocess.to_classifier()
    print(c.shape)

    s, v = preprocess.to_encoder()
    print(s.shape, v)
    print(s)

    preprocess._delete_audio_chunks()