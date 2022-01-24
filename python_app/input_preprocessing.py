import numpy as np
import torchaudio
import librosa
import os
import glob
import torch
import torch.nn as nn
from pydub import AudioSegment
from enricher_models import CNN, VAE

class preprocessor:
    def __init__(self, filepath):
        input_audio = AudioSegment.from_wav(filepath)

        # transformation to mono, downsampling
        input_audio = input_audio.set_channels(1)
        input_audio = input_audio.set_frame_rate(22050)

        # splitting into chunks of 3 seconds for processing in NN
        n_chunks = len(input_audio)//3000

        for i in range(n_chunks-1):
            input_audio[(i*3000): ((i+1)*3000)].export(f'temp_audio_files/file{i}.wav', format='wav')
            
        self.audio_chunks = glob.glob('temp_audio_files/*.wav')

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
        vae = VAE.load('model')
        
        signal = librosa.load('temp_audio_files/file10.wav', sr=22050, duration=3, mono=True)[0]
        stft = librosa.stft(signal, n_fft=512, hop_length=259)[:-1]
        spectrogram = np.abs(stft)
        log_spectrogram = librosa.amplitude_to_db(spectrogram)

        min_val, max_val = np.min(log_spectrogram), np.max(log_spectrogram)
        norm_spectrogram = (log_spectrogram - min_val) / (max_val - min_val)

        generated_spectrogram, latent_representations = vae.reconstruct(norm_spectrogram)
        
        log_spectrogram = spectrogram[:, :, 0]
        # apply denormalisation
        denorm_log_spec = ((generated_spectrogram - generated_spectrogram.min()) / (generated_spectrogram.max()-generated_spectrogram.min()))
        denorm_log_spec = denorm_log_spec * (max_val - min_val) + min_val
        # log spectrogram -> spectrogram
        spec = librosa.db_to_amplitude(denorm_log_spec)
        # apply Griffin-Lim
        signal = librosa.istft(spec, hop_length=259)
        print(signal)

    def _delete_audio_chunks(self):
        for file in self.audio_chunks:
            os.remove(file)

if __name__=='__main__':
    preprocess = preprocessor('/home/christian/Documents/sound_classifier/test_sounds/witchfucker.wav')
    x = preprocess.to_classifier()
    preprocess._delete_audio_chunks()
    
    from enricher_models import CNN
    import torch
    import torch.nn as nn

    model = CNN()
    model.load_state_dict(torch.load('models/nn_classifier_statedict.pt', map_location='cpu'))

    def get_genre(input_tensor):
        # list of genres
        genres = ['disco','metal','blues','jazz','country','hiphop','rock','classical','pop','reggae']

        # run through model
        with torch.no_grad():
            result = model(input_tensor)

        # postprocessing results
        result = torch.mean(result, dim=0)
        result = nn.Softmax(dim=0)(result)
        result = {g:p.item()*100 for g, p in zip(genres, result)}

        return result
    
    print(get_genre(x))

