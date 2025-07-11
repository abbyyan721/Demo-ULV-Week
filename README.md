# SwingPro Demo - AI-Powered Golf Swing Analysis

A demonstration project showcasing AI-powered golf swing analysis that compares your swing technique to professional golfers.

## Features

- **Real AI Analysis**: Uses MediaPipe pose detection and machine learning to analyze golf swing videos
- **Pro Comparison**: Compare your swing to professional golfers like Tiger Woods, Rory McIlroy, Nelly Korda, Scottie Scheffler, and Lydia Ko
- **Instant Feedback**: Get detailed analysis with specific recommendations for improvement
- **Technical Metrics**: View detailed technical metrics including knee angle consistency, hip rotation timing, backswing height, and more

## How to Use

1. **Start the Backend Server**:
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5001`

2. **Open the Frontend**:
   - Open `index.html` in your web browser
   - Or serve it using a local server

3. **Try the Analysis**:
   - Choose a professional golfer from the dropdown
   - Upload a video of your golf swing (MP4, AVI, MOV, or MKV format)
   - Click "Get AI Analysis" to receive instant feedback
   - View detailed results directly on the same page, comparing your swing to the selected pro
   - Use "Try Another Swing" to analyze a different video or "Download Results" to save your analysis

## Technical Details

- **Backend**: Flask server with MediaPipe pose detection
- **AI Model**: Random Forest classifier for swing similarity scoring
- **Frontend**: HTML, CSS, JavaScript with modern UI design
- **Video Processing**: Real-time pose landmark extraction and analysis

## Project Structure

```
Summer School AI/
├── app.py              # Flask backend server
├── index.html          # Main frontend page with integrated results
├── script.js           # Frontend JavaScript
├── styles.css          # Frontend styling
├── uploads/            # Temporary video uploads
├── sessions/           # Analysis session results
└── venv/              # Python virtual environment
```

## Demo Features

This is a working demo that:
- ✅ Processes real golf swing videos
- ✅ Extracts pose landmarks using MediaPipe
- ✅ Analyzes swing characteristics
- ✅ Compares to professional golfer techniques
- ✅ Provides detailed feedback and metrics
- ✅ Saves analysis sessions for review

No free trial or signup required - just upload your swing video and get instant AI analysis!
