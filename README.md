# Hand Gesture Detector 🤚

A real-time hand gesture recognition web application that uses your webcam to detect and classify various hand gestures. Built with React and computer vision techniques.

![Hand Gesture Detector](https://img.shields.io/badge/React-18.x-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Real-time Detection**: Instant hand gesture recognition using your webcam
- **Multiple Gestures**: Recognizes 5 different hand gestures:
  - Open Palm
  - Fist
  - Pointing
  - Peace Sign
  - Thumbs Up
- **Confidence Scoring**: Visual confidence meter showing detection accuracy
- **Responsive Design**: Beautiful gradient UI that works on all screen sizes
- **No External APIs**: All processing happens client-side in the browser


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/cd2bc945-877c-42e1-839c-2dc93bdfcbc8" />


## How It Works

The application uses computer vision techniques to analyze video frames in real-time:

1. **Skin Tone Detection**: Identifies skin-colored pixels using RGB thresholds
2. **Pattern Analysis**: Analyzes the distribution and ratio of detected skin pixels
3. **Gesture Classification**: Matches patterns to predefined gesture signatures
4. **Confidence Calculation**: Provides a confidence score for each detection

<img width="1910" height="972" alt="Screenshot 2025-12-09 211616" src="https://github.com/user-attachments/assets/bb543083-ce09-4e14-a855-3d437ea8c501" />

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hand-gesture-detector.git
cd hand-gesture-detector
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Click the **"Start Detection"** button to activate your webcam
2. Allow camera permissions when prompted by your browser
3. Position your hand clearly in front of the camera
4. Try different hand gestures and watch them being detected in real-time
5. Click **"Stop Detection"** to turn off the camera

### Tips for Best Results

- Ensure good lighting conditions
- Keep your hand at a moderate distance from the camera (1-2 feet)
- Use a simple background without skin-colored objects
- Make clear, distinct gestures
- Hold gestures steady for better detection

## Technologies Used

- **React**: Frontend framework
- **Lucide React**: Icon library
- **Canvas API**: For video frame processing
- **MediaDevices API**: For webcam access
- **Tailwind CSS**: For styling

## Browser Compatibility

The application works best on modern browsers that support:
- `getUserMedia()` API
- HTML5 Canvas
- ES6+ JavaScript

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
hand-gesture-detector/
├── src/
│   ├── App.js                 # Main application component
│   ├── components/
│   │   └── HandGestureDetector.js
│   ├── styles/
│   └── index.js
├── public/
│   └── index.html
├── package.json
└── README.md
```

## Gesture Detection Algorithm

The detection algorithm follows these steps:

1. Capture video frame from webcam
2. Convert frame to canvas ImageData
3. Iterate through pixels to detect skin tones using RGB criteria:
   - R > 95, G > 40, B > 20
   - max(R,G,B) - min(R,G,B) > 15
   - abs(R-G) > 15, R > G, R > B
4. Calculate skin pixel ratio and center of mass
5. Match patterns to gesture signatures
6. Return best matching gesture with confidence score

## Limitations

- Detection accuracy depends on lighting conditions
- Works best with simple backgrounds
- May have difficulty with very dark or very light skin tones
- Simplified gesture recognition (not ML-based)

## Future Enhancements

- [ ] Integrate machine learning models (TensorFlow.js, MediaPipe)
- [ ] Add more complex gestures
- [ ] Gesture history tracking
- [ ] Custom gesture training
- [ ] Multi-hand detection
- [ ] Gesture-based controls for web interactions
- [ ] Recording and playback features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by computer vision and gesture recognition research
- Icons provided by [Lucide](https://lucide.dev/)
- Built with React and modern web technologies

## 👨‍💻 Author

Om Gedam

GitHub: @itsomg134

Email: omgedam123098@gmail.com

Twitter (X): @omgedam

LinkedIn: Om Gedam

Portfolio: https://ogworks.lovable.app

