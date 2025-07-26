from rembg import remove
from PIL import Image, ImageFilter
import io

# ইনপুট এবং আউটপুট ফাইল
input_path = "input.jpg"
output_path = "output.png"

# ইনপুট ফাইল ওপেন করে ব্যাকগ্রাউন্ড রিমুভ
with open(input_path, "rb") as i:
    input_data = i.read()

# উন্নত মডেল (isnet-general-use) ব্যবহার করে রিমুভ
output_data = remove(input_data, session_name="isnet-general-use")

# Image object-এ কনভার্ট করে edge smooth
img = Image.open(io.BytesIO(output_data)).convert("RGBA")
img = img.filter(ImageFilter.SMOOTH_MORE)

# আউটপুট ফাইল সেইভ
img.save(output_path)

print("✅ Background removed & smoothed successfully!")
