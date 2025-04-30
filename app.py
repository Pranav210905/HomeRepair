from flask import Flask, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI

from langchain.chains import ConversationChain
from googletrans import Translator
from deep_translator import GoogleTranslator

import os

from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)





# Setup Gemini API
os.environ["GOOGLE_API_KEY"] = "AIzaSyB-Kk3iY0NosTWZ8faoj5qbBOttBqMLXKE"  # Replace with your actual Gemini API key

# Initialize Flask App

translator = Translator()
def initialize_llm():
    gemini_api_key = "AIzaSyB-Kk3iY0NosTWZ8faoj5qbBOttBqMLXKE"  # Replace with your actual Gemini API key
    model_name = "gemini-1.5-pro-latest"  
    llm = ChatGoogleGenerativeAI(api_key=gemini_api_key, model=model_name)
    return llm

# Setup LangChain with Gemini
llm = initialize_llm()


chain = ConversationChain(llm=llm)

# 🌍 Language support - major Indian languages
language_map = {
    'english': 'en',
    'hindi': 'hi',
    'telugu': 'te',
    'tamil': 'ta',
    'kannada': 'kn',
    'malayalam': 'ml',
    'bengali': 'bn',
    'marathi': 'mr',
    'gujarati': 'gu',
    'punjabi': 'pa',
    'urdu': 'ur',
    'odia': 'or',
    'assamese': 'as',
    'sanskrit': 'sa'
}

# 🟢 Welcome Message Handler
@app.route("/welcome", methods=["GET"])
def welcome():
    language = request.args.get("language", "english").lower()
    welcome_text = "Welcome to our Home Services website! How can I assist you today?"

    if language != 'english':
        lang_code = language_map.get(language, 'en')
        translated = GoogleTranslator(source='auto', target=lang_code).translate(welcome_text)
        return jsonify({"welcome_message": translated})

    return jsonify({"welcome_message": welcome_text})

# 🟡 Help Response Function
def generate_response(user_query, language='english'):
    prompt = (
        "You are a help assistant for a home services website. "
        "Give clear, short (2-3 lines), and simple answers in plain English. "
        "Support services include Electrical, Painting, Plumbing, Carpentry, Cleaning, Appliance Repair, Pest Control, AC Services, CCTV, Interior Design, Gardening, Home Automation.\n\n"
        f"User question: {user_query}"
    )
    answer = chain.invoke(prompt)

    if language.lower() != 'english':
        lang_code = language_map.get(language.lower(), 'en')
        short_answer = answer.strip()[:4500]  # Just in case, keep it well below 5000
        translated = GoogleTranslator(source='auto', target=lang_code).translate(short_answer)
        return translated
    print(answer)
    return answer

# 🟣 Main /ask Endpoint
@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    print(data)
    question = data.get("question")
    language = data.get("language", "english").lower()

    if not question:
        return jsonify({"error": "Please provide a question"}), 400

    if language not in language_map:
        return jsonify({"error": f"Language '{language}' not supported."}), 400

    reply = generate_response(question, language)
    
    return jsonify({"response": reply})

# 🔵 Run Flask App
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'images' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('images')
    uploaded_files = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to filename to make it unique
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            new_filename = f"{timestamp}_{filename}"
            
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
            file.save(file_path)
            
            # Return the relative path that can be used to access the file
            uploaded_files.append(f"/uploads/{new_filename}")
    
    return jsonify({
        'message': 'Files uploaded successfully',
        'files': uploaded_files
    })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)




@app.route('/bookings', methods=['POST'])
def create_booking():
    try:
        data = request.get_json()

        # Assuming BookingModel has a `create` method or similar
        new_booking = BookingModel(**data)
        new_booking.save()  # save to the database
        
        return jsonify(new_booking.to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to create booking'}), 500






if __name__ == "__main__":
    app.run(debug=True)
