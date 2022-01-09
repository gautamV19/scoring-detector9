This repository contains the submitted solution as part of the *MTX - HackOlympics 2.0*. The task involved development of a Web Application for 'Scoring Event Detection in Basketball Videos' and involved expertise in cloud computing, artificial intelligence, machine learning, frontend and backend web development to put together solutions to the problem set provided.

PROBLEM STATEMENT
The ever-growing collection of data combined with the fast advancement in Artificial
Intelligence, Machine Learning, and Deep Learning have opened endless opportunities in team
sports like basketball, football, and soccer, to name a few.
There is a colossal amount of video data for sports. The first step to employ this data for
performance enhancement and improved decision making, both on a team as well as an
athlete level, might be to develop algorithms that make machines understand the important
events that take place during a sports match.
To that end, the goal of this problem statement is to detect the occurrence of scoring events in
basketball game videos. We are interested in detecting only two modes of scoring, i.e 2 pointers
and 3 pointers. Given a video snippet, the objective is to perform binary classification to predict
if the input video snippet contains a scoring event (either 2 pointer or 3 pointer) or not.
ML MODELLING DETAILS
1. Input: The input would be a 2 second long video clip. The video clips containing a scoring event
(2 pointer or 3 pointer) would be labelled as 1, else 0
2. Output: Being a classification problem, the model output would be a prediction that indicates if
the input video clip contains a scoring event (2 pointer or 3 pointer) or not.
3. Inference on long untrimmed videos: In addition to the above, the participating team should
also write an inference script that takes a long untrimmed video as an input and generates a
plot showing how the scoring event probability (output of the above classification model)
evolves over the length of the input video. We’ll provide a long untrimmed video for reference,
but the participants are free to choose any other appropriate input video for the purpose of
demonstration (Hint: You may consider splitting the long untrimmed video into multiple
segments of appropriate length and use the classification model to obtain the scoring event
probability for each such segment)
APPLICATION DEVELOPMENT
In addition to the above backend model scripts, one needs to create a front end web page
interacting with the backend model to show the live inference results.
The front end API should have the following features:
a. Ask the user to upload a video snippet of a basketball game. Note that the video
formats supported by the application and the model should be clearly mentioned.
b.
In order to perform inference on the input video, you may consider splitting the input
video into multiple segments of appropriate length and obtain the inference result
(probability of a scoring event) on each segment.
c. Display the results by plotting how the output scoring event probability score evolves
over the length of the input video.
d. A list view of all the detected scoring events, should be shown on the UI, with the
capability of being able to seek to any scoring event.
