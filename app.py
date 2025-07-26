from flask import Flask, request, send_file, render_template_string
from flask_cors import CORS  # ✅ CORS import করো
from rembg import remove
from PIL import Image, ImageFilter
import io
import os

app = Flask(__name__)
CORS(app)  # ✅ JavaScript fetch request সাপোর্ট করার জন্য CORS চালু করো

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def index():
    html = '''
    <h2>🖼️ Upload an Image to Remove Background</h2>
    <form method="POST" action="/remove" enctype="multipart/form-data">
        <input type="file" name="image" required>
        <button type="submit">Remove Background</button>
    </form>
    '''
    return render_template_string(html)

@app.route('/remove', methods=['POST'])
def remove_background():
    file = request.files.get('image')
    if not file:
        return "No file uploaded.", 400

    input_data = file.read()

    # ব্যাকগ্রাউন্ড রিমুভ + edge smooth
    output_data = remove(input_data)  # session_name বাদ দিলাম যেনো ডিফল্ট মডেল কাজ করে
    img = Image.open(io.BytesIO(output_data)).convert("RGBA")
    img = img.filter(ImageFilter.SMOOTH_MORE)

    output_io = io.BytesIO()
    img.save(output_io, format='PNG')
    output_io.seek(0)

    return send_file(output_io, mimetype='image/png', as_attachment=False)

if __name__ == '__main__':
    app.run(debug=True)
