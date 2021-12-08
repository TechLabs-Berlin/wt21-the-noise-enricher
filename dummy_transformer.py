import sys
import numpy as np
import json
import torch
import torchaudio
import matplotlib.pyplot as plt

# define input file
if len(sys.argv)>1:
    audio_input_file = sys.argv[1]
else:
    audio_input_file = 'piano_16000_mono.wav'

# for creating a inverse spectrogram, the spectrogram must contain complex numbers
# complex numbers cannot be displayed in a graph, they must be transformed in real numbers later
trans_spec     = torchaudio.transforms.Spectrogram(n_fft=800, power=None, return_complex=True)
trans_spec_inv = torchaudio.transforms.InverseSpectrogram(n_fft=800)


# SOUND TRANSFORMATION
# transform to waveform, spectrogram
waveform, sr_input = torchaudio.load(audio_input_file)
spec = trans_spec(waveform)

# adding some noise
spec_ = torch.clone(spec)
x, y = spec_.shape[1:]
noise_tnsr = torch.randn(x, y, dtype=torch.cdouble)
spec_[0,:,:] = spec_[0,:,:] + noise_tnsr

# save to audio file
wf_noise = trans_spec_inv(spec_)
torchaudio.save('output.wav', wf_noise, sr_input)


# OUTPUTS
# write file specs in json file
input_audio_info_ = torchaudio.info(audio_input_file)
input_audio_info = {
    'sample_rate': input_audio_info_.sample_rate,
    'num_frames': input_audio_info_.num_frames,
    'num_channels': input_audio_info_.num_channels,
    'bits_per_sample': input_audio_info_.bits_per_sample,
    'encoding': input_audio_info_.encoding}

with open('input_audio_info.txt', 'w') as outfile_input_info:
  json.dump(input_audio_info, outfile_input_info)

# plotting waveform of input file
kwargs = {'dpi': 200, 'bbox_inches': 'tight', 'pad_inches': 0}
time_axis = torch.arange(0, input_audio_info_.num_frames) / sr_input
plt.figure(figsize=(10,6))
plt.plot(time_axis, waveform[0][:])
plt.savefig('input_waveform.jpg', **kwargs)

# plotting spectrogram of input file
plt.figure(figsize=(10,6))
plt.imshow(spec.log2().real[0,:,:].numpy(), aspect='auto')
plt.axis('off')
plt.savefig('input_spectrogram.jpg', **kwargs)

# plotting spectrogram of output file
plt.figure(figsize=(10,6))
plt.imshow(spec_.log2().real[0,:,:].numpy(), aspect='auto')
plt.axis('off')
plt.savefig('output_spectrogram.jpg', **kwargs)

# plotting waveform of input file
plt.figure(figsize=(10,6))
plt.plot(wf_noise[0][:])
plt.savefig('output_waveform.jpg', **kwargs)