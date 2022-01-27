import sys
from input_preprocessing import preprocessor
from sound_generator import create_sound


# sys.argv[1] path to wav file
# sys.argv[2] unique file name
preprocess = preprocessor(sys.argv[1], sys.argv[2], sys.argv[3])

input_arrays, minmax = preprocess.to_encoder()
create_sound(input_arrays, minmax, sys.argv[2], sys.argv[3])

print('Done!')
