from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
import torch.nn as nn
import cv2
import numpy as np
from scipy.ndimage import gaussian_filter
import matplotlib.pyplot as plt
import io
import base64
from PIL import Image
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global model variable
model = None
device = 'cuda' if torch.cuda.is_available() else 'cpu'

# Heat map configuration
HEAT_MAP_CONFIG = {
    'high_threshold': 0.7,
    'medium_threshold': 0.3,
    'alpha': 0.6,
    'colors': {
        'high': [255, 0, 0],    # Red
        'medium': [255, 255, 0], # Yellow  
        'low': [0, 255, 0]      # Green
    }
}

# ====================================================================================================
# MODEL ARCHITECTURE (Your MC-CNN)
# ====================================================================================================
class MC_CNN(nn.Module):
    def __init__(self):
        super().__init__()
        
        self.column1 = nn.Sequential(
            nn.Conv2d(3, 8, 9, padding='same'),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(8, 16, 7, padding='same'),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 7, padding='same'),
            nn.ReLU(),
            nn.Conv2d(32, 16, 7, padding='same'),
            nn.ReLU(),
            nn.Conv2d(16, 8, 7, padding='same'),
            nn.ReLU(),
        )
        
        self.column2 = nn.Sequential(
            nn.Conv2d(3, 10, 7, padding='same'),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(10, 20, 5, padding='same'),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(20, 40, 5, padding='same'),
            nn.ReLU(),
            nn.Conv2d(40, 20, 5, padding='same'),
            nn.ReLU(),
            nn.Conv2d(20, 10, 5, padding='same'),
            nn.ReLU(),
        )
        
        self.column3 = nn.Sequential(
            nn.Conv2d(3, 12, 5, padding='same'),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(12, 24, 3, padding='same'),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(24, 48, 3, padding='same'),
            nn.ReLU(),
            nn.Conv2d(48, 24, 3, padding='same'),
            nn.ReLU(),
            nn.Conv2d(24, 12, 3, padding='same'),
            nn.ReLU(),
        )
        
        self.fusion_layer = nn.Sequential(
            nn.Conv2d(30, 1, 1, padding=0),
        )
    
    def forward(self, img_tensor):
        x1 = self.column1(img_tensor)
        x2 = self.column2(img_tensor)
        x3 = self.column3(img_tensor)
        x = torch.cat((x1, x2, x3), 1)
        x = self.fusion_layer(x)
        return x

# ====================================================================================================
# HELPER FUNCTIONS
# ====================================================================================================
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path, target_size=(1024, 768), gt_downsample=4):
    """Preprocess image for prediction"""
    img = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    original_img = img.copy()
    
    if len(img.shape) == 2:
        img = np.stack([img, img, img], axis=-1)
    
    if target_size:
        img = cv2.resize(img, target_size)
    
    ds_rows = int(img.shape[0] // gt_downsample)
    ds_cols = int(img.shape[1] // gt_downsample)
    img = cv2.resize(img, (ds_cols * gt_downsample, ds_rows * gt_downsample))
    
    img = img.transpose((2, 0, 1))
    img_tensor = torch.tensor(img / 255.0, dtype=torch.float).unsqueeze(0)
    
    return img_tensor, original_img

def create_heat_map_overlay(image, density_map, alpha=0.6):
    """Create color-coded heat map overlay"""
    if density_map.max() > 0:
        normalized_density = density_map / density_map.max()
    else:
        normalized_density = density_map
    
    heat_map = np.zeros((*density_map.shape, 3), dtype=np.uint8)
    
    high_threshold = HEAT_MAP_CONFIG['high_threshold']
    medium_threshold = HEAT_MAP_CONFIG['medium_threshold']
    
    # Apply colors
    low_mask = normalized_density <= medium_threshold
    heat_map[low_mask] = HEAT_MAP_CONFIG['colors']['low']
    
    medium_mask = (normalized_density > medium_threshold) & (normalized_density <= high_threshold)
    heat_map[medium_mask] = HEAT_MAP_CONFIG['colors']['medium']
    
    high_mask = normalized_density > high_threshold
    heat_map[high_mask] = HEAT_MAP_CONFIG['colors']['high']
    
    heat_map_resized = cv2.resize(heat_map, (image.shape[1], image.shape[0]))
    overlay = cv2.addWeighted(image.astype(np.uint8), 1-alpha, heat_map_resized, alpha, 0)
    
    return overlay, heat_map_resized

def get_congestion_stats(density_map, predicted_count):
    """Calculate congestion statistics"""
    if density_map.max() > 0:
        normalized_density = density_map / density_map.max()
    else:
        normalized_density = density_map
    
    high_threshold = HEAT_MAP_CONFIG['high_threshold']
    medium_threshold = HEAT_MAP_CONFIG['medium_threshold']
    
    high_congestion = np.sum(normalized_density > high_threshold)
    medium_congestion = np.sum((normalized_density > medium_threshold) & (normalized_density <= high_threshold))
    low_congestion = np.sum(normalized_density <= medium_threshold)
    total_pixels = density_map.size
    
    return {
        'total_count': round(predicted_count, 1),
        'high_congestion_pixels': int(high_congestion),
        'medium_congestion_pixels': int(medium_congestion),
        'low_congestion_pixels': int(low_congestion),
        'high_congestion_percent': round(100 * high_congestion / total_pixels, 1),
        'medium_congestion_percent': round(100 * medium_congestion / total_pixels, 1),
        'low_congestion_percent': round(100 * low_congestion / total_pixels, 1),
        'max_density': float(density_map.max()),
        'avg_density': float(density_map.mean()),
        'total_density': float(density_map.sum())
    }

def image_to_base64(img_array):
    """Convert numpy array to base64 string"""
    img_pil = Image.fromarray(img_array.astype(np.uint8))
    buffer = io.BytesIO()
    img_pil.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return img_str

# ====================================================================================================
# API ROUTES
# ====================================================================================================
@app.route('/', methods=['GET'])
def home():
    """API documentation"""
    return """
    <h1>🎯 Crowd Counting API with Heat Map</h1>
    <h2>Endpoints:</h2>
    <ul>
        <li><b>POST /predict</b> - Upload image for crowd counting with heat map
            <ul>
                <li>Upload image file with key 'image'</li>
                <li>Returns count, heat map images, and congestion statistics</li>
            </ul>
        </li>
        <li><b>GET /health</b> - Check API health status</li>
    </ul>
    
    <h2>Heat Map Color Legend:</h2>
    <ul>
        <li>🟢 <b>Green</b>: Normal crowd density (&lt;30%)</li>
        <li>🟡 <b>Yellow</b>: Moderate congestion (30-70%)</li>
        <li>🔴 <b>Red</b>: High congestion (&gt;70%)</li>
    </ul>
    
    <h2>Example Usage:</h2>
    <pre>
import requests

# Upload image for prediction
with open('crowd_image.jpg', 'rb') as f:
    response = requests.post('http://localhost:5000/predict', files={'image': f})
    result = response.json()
    print(f"Predicted count: {result['predicted_count']}")
    </pre>
    """

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'device': device,
        'api_version': '1.0'
    })

@app.route('/predict', methods=['POST'])
def predict_crowd():
    """Main prediction endpoint"""
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid image file'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        temp_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(temp_path)
        
        try:
            # Preprocess and predict
            img_tensor, original_img = preprocess_image(temp_path)
            img_tensor = img_tensor.to(device)
            
            with torch.no_grad():
                density_map = model(img_tensor)
                predicted_count = density_map.sum().item()
                density_map_np = density_map.squeeze().cpu().numpy()
            
            # Create heat map overlay
            overlay, heat_map = create_heat_map_overlay(original_img, density_map_np)
            
            # Get congestion statistics
            stats = get_congestion_stats(density_map_np, predicted_count)
            
            # Convert images to base64
            response_data = {
                'success': True,
                'predicted_count': round(predicted_count, 1),
                'congestion_analysis': {
                    'high_congestion_percent': stats['high_congestion_percent'],
                    'medium_congestion_percent': stats['medium_congestion_percent'],
                    'low_congestion_percent': stats['low_congestion_percent'],
                    'high_congestion_pixels': stats['high_congestion_pixels'],
                    'medium_congestion_pixels': stats['medium_congestion_pixels'],
                    'low_congestion_pixels': stats['low_congestion_pixels']
                },
                'density_statistics': {
                    'max_density': stats['max_density'],
                    'avg_density': stats['avg_density'],
                    'total_density': stats['total_density']
                },
                'images': {
                    'original': image_to_base64(original_img),
                    'heatmap_overlay': image_to_base64(overlay),
                    'pure_heatmap': image_to_base64(heat_map),
                    'density_map': image_to_base64((density_map_np * 255).astype(np.uint8))
                },
                'color_legend': {
                    'green': 'Normal crowd density (<30%)',
                    'yellow': 'Moderate congestion (30-70%)',
                    'red': 'High congestion (>70%)'
                }
            }
            
            return jsonify(response_data)
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

# ====================================================================================================
# MODEL LOADING
# ====================================================================================================
def load_model(model_path):
    """Load the trained model"""
    global model
    try:
        model = MC_CNN().to(device)
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.eval()
        print(f"✅ Model loaded successfully from {model_path}")
        print(f"🎯 Device: {device}")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

# ====================================================================================================
# MAIN
# ====================================================================================================
if __name__ == '__main__':
    # Load your model - UPDATE THIS PATH
    MODEL_PATH = 'best_crowd_counting_model.pth'  # Update with your model path
    
    if os.path.exists(MODEL_PATH):
        if load_model(MODEL_PATH):
            print("🚀 Starting Crowd Counting API...")
            print("🌐 API will be available at: http://localhost:3000")
            print("📡 Endpoints:")
            print("   GET  /        - API documentation")
            print("   GET  /health  - Health check")
            print("   POST /predict - Upload image for crowd counting")
            print("\n🎨 Heat Map Legend:")
            print("   🟢 Green: Normal density")
            print("   🟡 Yellow: Moderate congestion") 
            print("   🔴 Red: High congestion")
            
            app.run(host='0.0.0.0', port=3000, debug=False)
        else:
            print("❌ Failed to load model. API not started.")
    else:
        print(f"❌ Model file not found: {MODEL_PATH}")
        print("💡 Please place your model file in the same directory as this script")
