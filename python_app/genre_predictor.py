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
        result = self.classifier(input_tensor)

    # postprocessing results
    result = torch.mean(result, dim=0)
    result = nn.Softmax(dim=0)(result)
    result = {g:p.item()*100 for g, p in zip(genres, result)}

    return result

