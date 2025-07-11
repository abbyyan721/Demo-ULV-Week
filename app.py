from flask import Flask, request, jsonify
from flask_cors import CORS
import mediapipe as mp
import cv2
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics.pairwise import cosine_similarity
import json
import os
import uuid
from werkzeug.utils import secure_filename
import pickle
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure upload folder and sessions storage
UPLOAD_FOLDER = 'uploads'
SESSIONS_FOLDER = 'sessions'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(SESSIONS_FOLDER):
    os.makedirs(SESSIONS_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Mock trained model (in production, you'd load a real trained model)
def load_trained_model():
    """Load the trained scikit-learn model"""
    # For now, create a mock RandomForest model
    # In production, you would load a pre-trained model:
    # with open('golf_swing_model.pkl', 'rb') as f:
    #     return pickle.load(f)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    # Mock training data (in production, this would be real training data)
    X_mock = np.random.rand(100, 10)  # 100 samples, 10 features
    y_mock = np.random.randint(0, 100, 100)  # Mock similarity scores
    model.fit(X_mock, y_mock)
    return model

def extract_swing_features(video_path):
    """Extract features from golf swing video using MediaPipe"""
    cap = cv2.VideoCapture(video_path)
    landmarks_data = []
    
    with mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as pose:
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert BGR to RGB
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            # Make detection
            results = pose.process(image)
            
            if results.pose_landmarks:
                frame_landmarks = []
                for landmark in results.pose_landmarks.landmark:
                    frame_landmarks.extend([landmark.x, landmark.y, landmark.z])
                landmarks_data.append(frame_landmarks)
            
    cap.release()
    
    if not landmarks_data:
        return None
    
    # Extract features from landmarks
    landmarks_array = np.array(landmarks_data)
    
    # Calculate various swing features
    features = {}
    
    # 1. Knee angle consistency
    knee_angles = []
    for frame in landmarks_data:
        if len(frame) >= 87:  # 29 landmarks * 3 coordinates
            left_knee = frame[25*3:25*3+3]  # left_knee index
            right_knee = frame[26*3:26*3+3]  # right_knee index
            left_hip = frame[23*3:23*3+3]  # left_hip index
            right_hip = frame[24*3:24*3+3]  # right_hip index
            
            # Calculate knee angles
            knee_angle = abs(left_knee[1] - right_knee[1])
            knee_angles.append(knee_angle)
    
    features['knee_angle_std'] = np.std(knee_angles) if knee_angles else 0
    features['knee_angle_mean'] = np.mean(knee_angles) if knee_angles else 0
    
    # 2. Hip rotation timing
    hip_positions = []
    for frame in landmarks_array:
        if len(frame) >= 87:
            left_hip = frame[23*3:23*3+3]
            right_hip = frame[24*3:24*3+3]
            hip_center = [(left_hip[0] + right_hip[0])/2, (left_hip[1] + right_hip[1])/2]
            hip_positions.append(hip_center)
    
    if len(hip_positions) > 1:
        hip_movement = np.linalg.norm(np.diff(hip_positions, axis=0), axis=1)
        features['hip_rotation_speed'] = np.mean(hip_movement)
        features['hip_rotation_consistency'] = np.std(hip_movement)
    else:
        features['hip_rotation_speed'] = 0
        features['hip_rotation_consistency'] = 0
    
    # 3. Backswing height
    shoulder_positions = []
    for frame in landmarks_array:
        if len(frame) >= 87:
            left_shoulder = frame[11*3:11*3+3]
            right_shoulder = frame[12*3:12*3+3]
            shoulder_center = [(left_shoulder[0] + right_shoulder[0])/2, (left_shoulder[1] + right_shoulder[1])/2]
            shoulder_positions.append(shoulder_center)
    
    if shoulder_positions:
        shoulder_heights = [pos[1] for pos in shoulder_positions]
        features['backswing_height'] = max(shoulder_heights) - min(shoulder_heights)
        features['shoulder_stability'] = np.std(shoulder_heights)
    else:
        features['backswing_height'] = 0
        features['shoulder_stability'] = 0
    
    # 4. Overall movement consistency
    if len(landmarks_array) > 1:
        frame_differences = []
        for i in range(1, len(landmarks_array)):
            diff = np.linalg.norm(landmarks_array[i] - landmarks_array[i-1])
            frame_differences.append(diff)
        
        features['movement_consistency'] = np.std(frame_differences)
        features['movement_speed'] = np.mean(frame_differences)
    else:
        features['movement_consistency'] = 0
        features['movement_speed'] = 0
    
    # 5. Pose stability
    if len(landmarks_array) > 5:
        similarities = []
        for i in range(5, len(landmarks_array)):
            sim = cosine_similarity([landmarks_array[i]], [landmarks_array[i-5]])[0][0]
            similarities.append(sim)
        features['pose_stability'] = np.mean(similarities)
    else:
        features['pose_stability'] = 0
    
    return features

def predict_similarity_score(features, pro_name):
    """Predict similarity score between user's swing and selected pro"""
    # Load the trained model
    model = load_trained_model()
    
    # Convert features to feature vector
    feature_vector = np.array([
        features.get('knee_angle_std', 0),
        features.get('knee_angle_mean', 0),
        features.get('hip_rotation_speed', 0),
        features.get('hip_rotation_consistency', 0),
        features.get('backswing_height', 0),
        features.get('shoulder_stability', 0),
        features.get('movement_consistency', 0),
        features.get('movement_speed', 0),
        features.get('pose_stability', 0)
    ]).reshape(1, -1)
    
    # Predict similarity score (0-100)
    similarity_score = model.predict(feature_vector)[0]
    return max(0, min(100, similarity_score))

def generate_feedback(features, similarity_score):
    """Generate structured feedback based on features and similarity score"""
    feedback = {
        "overall_similarity": int(similarity_score),
        "knee_angle_match": "Good" if features.get('knee_angle_std', 1) < 0.05 else "Needs improvement",
        "hip_rotation_timing": "Good" if features.get('hip_rotation_consistency', 1) < 0.03 else "Needs improvement",
        "backswing_height": "Excellent" if features.get('backswing_height', 0) > 0.1 else "Good" if features.get('backswing_height', 0) > 0.05 else "Needs improvement",
        "shoulder_stability": "Good" if features.get('shoulder_stability', 1) < 0.02 else "Needs improvement",
        "movement_consistency": "Good" if features.get('movement_consistency', 1) < 0.01 else "Needs improvement"
    }
    return feedback

def save_session_result(session_id, pro_name, features, similarity_score, feedback):
    """Save analysis results to session file"""
    result = {
        "session_id": session_id,
        "pro_name": pro_name,
        "timestamp": datetime.now().isoformat(),
        "summary": f"Your swing shows {similarity_score}% similarity to {pro_name}'s technique",
        "metrics": {
            "overall_similarity": int(similarity_score),
            "knee_angle_std": float(features.get('knee_angle_std', 0)),
            "knee_angle_mean": float(features.get('knee_angle_mean', 0)),
            "hip_rotation_speed": float(features.get('hip_rotation_speed', 0)),
            "hip_rotation_consistency": float(features.get('hip_rotation_consistency', 0)),
            "backswing_height": float(features.get('backswing_height', 0)),
            "shoulder_stability": float(features.get('shoulder_stability', 0)),
            "movement_consistency": float(features.get('movement_consistency', 0)),
            "movement_speed": float(features.get('movement_speed', 0)),
            "pose_stability": float(features.get('pose_stability', 0))
        },
        "feedback": feedback
    }
    
    session_file = os.path.join(SESSIONS_FOLDER, f"{session_id}.json")
    with open(session_file, 'w') as f:
        json.dump(result, f, indent=2)
    
    return result

@app.route('/analyze', methods=['POST'])
def analyze_swing():
    """Analyze golf swing and compare with selected pro"""
    try:
        # Check if required fields are present
        if 'pro_name' not in request.form:
            return jsonify({"error": "pro_name is required"}), 400
        
        if 'video' not in request.files:
            return jsonify({"error": "video file is required"}), 400
        
        pro_name = request.form['pro_name']
        file = request.files['video']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400
        
        # Generate session ID
        session_id = str(uuid.uuid4())[:8]
        
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{session_id}_{filename}")
        file.save(filepath)
        
        try:
            # Extract features from video
            features = extract_swing_features(filepath)
            
            if features is None:
                return jsonify({"error": "No pose landmarks detected in video"}), 400
            
            # Predict similarity score
            similarity_score = predict_similarity_score(features, pro_name)
            
            # Generate feedback
            feedback = generate_feedback(features, similarity_score)
            
            # Save results
            result = save_session_result(session_id, pro_name, features, similarity_score, feedback)
            
            # Clean up uploaded file
            os.remove(filepath)
            
            return jsonify(result)
            
        except Exception as e:
            # Clean up file on error
            if os.path.exists(filepath):
                os.remove(filepath)
            raise e
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/results/<session_id>', methods=['GET'])
def get_results(session_id):
    """Get saved analysis results by session ID"""
    try:
        session_file = os.path.join(SESSIONS_FOLDER, f"{session_id}.json")
        
        if not os.path.exists(session_file):
            return jsonify({"error": "Session not found"}), 404
        
        with open(session_file, 'r') as f:
            result = json.load(f)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "Golf swing analyzer API is running",
        "endpoints": {
            "analyze": "POST /analyze - Analyze swing and compare with pro",
            "results": "GET /results/<session_id> - Get analysis results",
            "health": "GET /health - Health check"
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 