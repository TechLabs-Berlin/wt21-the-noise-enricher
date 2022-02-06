from enricher_models import CNN
from input_preprocessing import preprocessor
import torch
import torch.nn as nn

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

if __name__=='__main__':
    path_to_input_file = '/home/christian/Documents/sound_classifier/test_sounds/witchfucker.wav'
    path_to_model = 'models/nn_classifier_statedict.pt'
    
    model = CNN()
    model.load_state_dict(torch.load(path_to_model, map_location='cpu'))
        
    preprocess = preprocessor(path_to_input_file)
    input_tensor = preprocess.to_classifier()
    preprocess._delete_audio_chunks()

    genres = get_genre(input_tensor)

    print(genres)

