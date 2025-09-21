from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import mediapipe as mp
import numpy as np
import base64
import threading
import queue
import time
import asyncio
from typing import Optional
import io
from PIL import Image

app = FastAPI(title="Palm Detection API", version="1.0.0")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"  # Allow all origins for development - remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class PalmDetectionRequest(BaseModel):
    ip_address: str
    timeout: Optional[int] = 10  # Maximum time to wait for detection
    detection_sensitivity: Optional[float] = 0.7

class PalmDetectionResponse(BaseModel):
    success: bool
    palm_detected: bool
    message: str
    detection_count: int
    processed_frame: Optional[str] = None  # base64 encoded image
    timestamp: str

class VideoStream:
    """Optimized video streaming class for IP cameras"""
    def __init__(self, src):
        self.cap = cv2.VideoCapture(src)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        self.q = queue.Queue(maxsize=2)
        self.running = True
        self.connected = False
        
    def start(self):
        self.thread = threading.Thread(target=self.update)
        self.thread.start()
        return self
        
    def update(self):
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                break
                
            self.connected = True
            
            # Clear queue if it's full (drop old frames)
            if not self.q.empty():
                try:
                    self.q.get_nowait()
                except queue.Empty:
                    pass
            
            self.q.put(frame)
            
    def read(self):
        try:
            return self.q.get(timeout=1.0)
        except queue.Empty:
            return None
            
    def stop(self):
        self.running = False
        if hasattr(self, 'thread'):
            self.thread.join()
        self.cap.release()

class PalmDetectionAPI:
    """API version of Palm Detection"""
    
    def __init__(self, detection_confidence=0.7):
        # Initialize MediaPipe
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=detection_confidence,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils
        
    def is_palm_open(self, landmarks):
        """Detect if palm is open by checking finger positions"""
        finger_tips = [4, 8, 12, 16, 20]  # Thumb, Index, Middle, Ring, Pinky tips
        finger_pips = [3, 6, 10, 14, 18]  # Corresponding PIP joints
        
        fingers_up = 0
        
        # Check thumb
        if landmarks[finger_tips[0]].x > landmarks[finger_pips[0]].x:
            fingers_up += 1
            
        # Check other four fingers
        for i in range(1, 5):
            if landmarks[finger_tips[i]].y < landmarks[finger_pips[i]].y:
                fingers_up += 1
                
        return fingers_up >= 4
    
    def draw_detection_overlay(self, frame, detection_count):
        """Draw detection overlay on frame"""
        height, width = frame.shape[:2]
        
        # Create warning overlay
        overlay = frame.copy()
        
        # Warning banner
        warning_color = (0, 100, 255)  # Orange-red
        cv2.rectangle(overlay, (0, 0), (width, 80), warning_color, -1)
        
        # Warning text
        warning_text = "🚨 PALM DETECTED! 🚨"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1.2
        thickness = 2
        
        # Get text size for centering
        text_size = cv2.getTextSize(warning_text, font, font_scale, thickness)[0]
        text_x = (width - text_size[0]) // 2
        text_y = 50
        
        # Draw warning text
        cv2.putText(overlay, warning_text, (text_x, text_y), font, font_scale, (255, 255, 255), thickness)
        
        # Detection counter
        counter_text = f"Detections: {detection_count}"
        cv2.putText(overlay, counter_text, (20, 70), font, 0.6, (255, 255, 255), 2)
        
        # Blend overlay
        alpha = 0.8
        frame = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)
        
        return frame
    
    def process_frame(self, frame):
        """Process single frame for palm detection"""
        # Convert BGR to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        
        palm_detected = False
        detection_count = 0
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw hand landmarks
                self.mp_draw.draw_landmarks(
                    frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS,
                    self.mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                    self.mp_draw.DrawingSpec(color=(255, 0, 0), thickness=2)
                )
                
                # Check if palm is open
                if self.is_palm_open(hand_landmarks.landmark):
                    palm_detected = True
                    detection_count += 1
                    
                    # Draw bounding box around detected palm
                    h, w, c = frame.shape
                    cx_min = int(min([lm.x for lm in hand_landmarks.landmark]) * w)
                    cy_min = int(min([lm.y for lm in hand_landmarks.landmark]) * h)
                    cx_max = int(max([lm.x for lm in hand_landmarks.landmark]) * w)
                    cy_max = int(max([lm.y for lm in hand_landmarks.landmark]) * h)
                    
                    # Draw bright green bounding box
                    cv2.rectangle(frame, (cx_min-10, cy_min-10), (cx_max+10, cy_max+10), (0, 255, 0), 3)
                    cv2.putText(frame, 'OPEN PALM!', (cx_min, cy_min-20), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        return frame, palm_detected, detection_count
    
    def frame_to_base64(self, frame):
        """Convert OpenCV frame to base64 string"""
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL Image
        pil_image = Image.fromarray(frame_rgb)
        
        # Save to bytes
        buffer = io.BytesIO()
        pil_image.save(buffer, format='JPEG', quality=85)
        
        # Encode to base64
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return img_base64
    
    async def detect_palm_from_ip(self, ip_address: str, timeout: int = 10):
        """Main detection function for API"""
        video_stream = None
        
        try:
            # Initialize video stream
            video_stream = VideoStream(ip_address).start()
            
            # Wait for connection
            await asyncio.sleep(2.0)
            
            if not video_stream.connected:
                return {
                    "success": False,
                    "palm_detected": False,
                    "message": f"Failed to connect to IP camera: {ip_address}",
                    "detection_count": 0,
                    "processed_frame": None,
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                }
            
            start_time = time.time()
            frame_count = 0
            total_detections = 0
            last_processed_frame = None
            palm_detected_overall = False
            
            while time.time() - start_time < timeout:
                frame = video_stream.read()
                if frame is None:
                    await asyncio.sleep(0.1)
                    continue
                
                frame_count += 1
                
                # Process every 3rd frame for better performance
                if frame_count % 3 == 0:
                    processed_frame, palm_detected, detection_count = self.process_frame(frame.copy())
                    
                    if palm_detected:
                        palm_detected_overall = True
                        total_detections += detection_count
                        processed_frame = self.draw_detection_overlay(processed_frame, total_detections)
                    
                    last_processed_frame = processed_frame
                
                # If we detected a palm, we can return early
                if palm_detected_overall and last_processed_frame is not None:
                    break
                
                await asyncio.sleep(0.03)  # ~30 FPS
            
            # Prepare response
            if last_processed_frame is not None:
                frame_base64 = self.frame_to_base64(last_processed_frame)
            else:
                frame_base64 = None
            
            message = ""
            if palm_detected_overall:
                message = f"🚨 PALM DETECTED! Found {total_detections} open palm(s) in the video stream."
            else:
                message = f"No palm detected during {timeout} second monitoring period."
            
            return {
                "success": True,
                "palm_detected": palm_detected_overall,
                "message": message,
                "detection_count": total_detections,
                "processed_frame": frame_base64,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
        except Exception as e:
            return {
                "success": False,
                "palm_detected": False,
                "message": f"Error processing video stream: {str(e)}",
                "detection_count": 0,
                "processed_frame": None,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        
        finally:
            if video_stream:
                video_stream.stop()

# Global detector instance
detector = PalmDetectionAPI()

@app.post("/detect-palm", response_model=PalmDetectionResponse)
async def detect_palm(request: PalmDetectionRequest):
    """
    Detect palm from IP camera stream
    
    - **ip_address**: IP camera URL (e.g., 'http://192.168.0.111:4747/video')
    - **timeout**: Maximum time to monitor in seconds (default: 10)
    - **detection_sensitivity**: Detection confidence threshold (default: 0.7)
    """
    
    if not request.ip_address:
        raise HTTPException(status_code=400, detail="IP address is required")
    
    # Update detection sensitivity
    global detector
    detector = PalmDetectionAPI(detection_confidence=request.detection_sensitivity)
    
    # Process the request
    result = await detector.detect_palm_from_ip(
        ip_address=request.ip_address,
        timeout=request.timeout
    )
    
    return PalmDetectionResponse(**result)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Palm Detection API is running"}

@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "message": "Palm Detection API",
        "version": "1.0.0",
        "endpoints": {
            "detect-palm": "POST /detect-palm - Detect palm from IP camera",
            "health": "GET /health - Health check",
            "docs": "GET /docs - API documentation"
        }
    }

if __name__ == "__main__":
    import uvicorn
    # Change to bind to localhost specifically
    uvicorn.run(app, host="127.0.0.1", port=8000)
