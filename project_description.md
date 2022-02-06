# The Noise Enricher
## Project description

The Noise Enricher is a collaborative project of seven members from User Experience Design, Web Development, and Artificial Intelligence learning tracks. The team created and deployed a web application that allows users to upload own audio files and let the sound change by a neural network algorithm through enriching the input signal with specific sound features. 

To process the sound files provided by users and to obtain modified sound samples, a Variational Autoencoder Network (VAE) was set up that used spectrograms as numerical expressions of audio signals. The neural networks were trained on reconstructing music of a certain genre and then used to encode and decode other audio files. So, the Variational Autoencoder Networks transforms the audio input slightly by emphasizing the special music genre features, according to the choice of the user.

The project team built a pipeline to connect the neural network with user oriented interfaces. The pipeline preprocessed audio signals, sent it through neural networks and reconstructed the audio signal from generated spectrograms. The web development team was responsible for implementing AI algorithms within the user-friendly interface proposed by the UX team. Throughout the project, the web development team created a Node.js web application with server-side javascript templates, implemented the design of the application, connected the python-based backend with the Node.js backend, and deployed the application on the Heroku cloud platform.

The UX team was responsible for ideation, drawing wireframes, mockups (Figma), all the important design related questions, and for doing user research. Besides, UX accompanied the progress and provided valuable support on a lot of operative issues. 

The project team managed to deploy a working prototype within eight weeks, with the potential to add more features and further improve the user experience as well as the performance of the software.
