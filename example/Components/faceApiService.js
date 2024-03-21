import axios from 'axios';

const subscriptionKey = 'dad34ec6d5b7441f848d67c3491bd423';
const endpoint = 'https://upifacepay.cognitiveservices.azure.com/';

const faceApiService = {
 addFace: async (imageUrl) => {
    const url = `${endpoint}/face/v1.0/persongroups/UPI/persons`;
    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    };
    const body = {
      name: 'PersonName', // Replace with the person's name
      userData: 'UserData', // Optional
    };
    const response = await axios.post(url, body, { headers });
    return response.data;
 },

 recognizeFace: async (imageUrl) => {
    const url = `${endpoint}/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise`;
    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    };
    const body = {
      url: imageUrl,
    };
    const response = await axios.post(url, body, { headers });
    return response.data;
 },
 identifyFace: async (faceId) => {
  const url = `${endpoint}/face/v1.0/identify`;
  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscriptionKey,
  };
  const body = {
    faceIds: [faceId], // Array of face IDs to identify
    personGroupId: 'UPI', // Your person group ID
    maxNumOfCandidatesReturned: 1, // Number of candidates to return for each face
    confidenceThreshold: 0.5, // Confidence threshold for identification
  };
  const response = await axios.post(url, body, { headers });
  return response.data;
},
};

export default faceApiService;
