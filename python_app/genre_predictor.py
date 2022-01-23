import os
import torch
import torch.nn as nn
import torchaudio
from pydub import AudioSegment

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class CNN(nn.Module):
  def __init__(self):
    super().__init__()

    self.encoder = nn.Sequential(
        nn.Conv2d( 2,  16, kernel_size=3, stride=2), nn.Tanh(),
        nn.Conv2d(16,  32, kernel_size=3, stride=2), nn.Tanh(),
        nn.Conv2d(32,  64, kernel_size=3, stride=2), nn.Tanh(),
        nn.Conv2d(64, 128, kernel_size=3, stride=2), nn.Tanh(),
        nn.Conv2d(128, 256, kernel_size=3, stride=2), nn.Tanh(),
        nn.Flatten()
        )
    
    self.linear = nn.Sequential(
        nn.Linear(256*7*7, 10)
        )
    
  def forward(self, x):
    x = self.encoder(x)
    x = self.linear(x)

    return x


class genre_predictor():
    
    def __init__(self, path_to_statedict):
        self.model = CNN()
        self.model.load_state_dict(torch.load(path_to_statedict, map_location=device))

    
    def get_genre(self, file):
        # preprocessing audio file to tensor
        self.file = file
        self._split_audio()
        self._create_input_tensor()

        # list of genres
        genres = ['disco','metal','blues','jazz','country','hiphop','rock','classical','pop','reggae']
        
        # run through model
        with torch.no_grad():
            result = self.model(self.input_tensor)
        
        # postprocessing results
        result = torch.mean(result, dim=0)
        result = nn.Softmax(dim=0)(result)
        result = {g:p.item()*100 for g, p in zip(genres, result)}

        # delete temporary files
        self._delete_files()

        return result

    
    def _split_audio(self):
        input_audio = AudioSegment.from_wav(self.file)

        # transformation to mono, downsampling
        input_audio = input_audio.set_channels(1)
        input_audio = input_audio.set_frame_rate(22050)

        # splitting into chunks of 3 seconds for processing in NN
        n_chunks = len(input_audio)//3000

        for i in range(n_chunks-1):
            input_audio[(i*3000): ((i+1)*3000)].export(f'temp_audio_files/file{i}.wav', format='wav')
    
    
    def _create_input_tensor(self):
        spectrograms = []
        self.audio_chunks = os.listdir('temp_audio_files')

        for file in self.audio_chunks:
            wf, sr = torchaudio.load(os.path.join('temp_audio_files', file))
            spec = torchaudio.transforms.Spectrogram(n_fft=515, power=None, return_complex=True)(wf)
            spectrograms.append(spec)

        # create empty complex tensor and fill it with spectrograms of input audio
        input_tensor = torch.empty((len(spectrograms), 2, 258, 258), dtype=torch.float32)

        # fill tensor with spectrograms of input audio
        for i, s in enumerate(spectrograms): 
            input_tensor[i, 0] = s.real
            input_tensor[i, 1] = s.imag

        self.input_tensor = input_tensor
    
    
    def _delete_files(self):
        for f in self.audio_chunks:
            os.remove(os.path.join('temp_audio_files', f))
   



if __name__ == '__main__':
    
    path_to_statedict = 'models/nn_classifier_statedict.pt'
    path_to_audiofile = 'test_sounds/witchfucker.wav'
    
    predict_genre = genre_predictor(path_to_statedict)
    genres = predict_genre.get_genre(path_to_audiofile)
    print(genres)