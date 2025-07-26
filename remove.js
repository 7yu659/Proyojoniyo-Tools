let selectedFile, resultImgUrl = null;
let originalFilename = "download";

function showPreview() {
  const fileInput = document.getElementById('imageInput');
  const previewImage = document.getElementById('previewImage');
  const submitBtn = document.getElementById('submitBtn');
  const overlay = document.getElementById('processingOverlay');
  const downloadMainBtn = document.getElementById('downloadMainBtn');
  const downloadBtns = document.getElementById('downloadBtns');
  const errorMsg = document.getElementById('errorMsg');

  selectedFile = fileInput.files[0];

  if (selectedFile) {
    originalFilename = selectedFile.name.split('.').slice(0, -1).join('.') || 'download';
    previewImage.src = URL.createObjectURL(selectedFile);
    previewImage.style.display = 'block';

    overlay.style.display = 'none';
    submitBtn.style.display = 'block';
    downloadMainBtn.style.display = 'none';
    downloadBtns.classList.remove('show');
    errorMsg.textContent = '';

    setTimeout(() => {
      submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
}

async function removeBackground() {
  const overlay = document.getElementById('processingOverlay');
  const submitBtn = document.getElementById('submitBtn');
  const previewImage = document.getElementById('previewImage');
  const progressText = document.getElementById('progressPercent');
  const downloadBtn = document.getElementById('downloadMainBtn');
  const errorMsg = document.getElementById('errorMsg');

  if (!selectedFile) return alert("Please select an image");

  overlay.style.display = 'flex';
  submitBtn.style.display = 'none';
  errorMsg.textContent = '';

  let percent = 0;
  const interval = setInterval(() => {
    percent = Math.min(percent + Math.floor(Math.random() * 10 + 5), 100);
    progressText.textContent = percent + '%';
  }, 300);

  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const response = await fetch("http://127.0.0.1:5000/remove", {
      method: "POST",
      body: formData
    });

    clearInterval(interval);
    progressText.textContent = '100%';

    if (!response.ok) throw new Error("Failed");

    const blob = await response.blob();
    resultImgUrl = URL.createObjectURL(blob);
    previewImage.src = resultImgUrl;

    overlay.style.display = 'none';

    setTimeout(() => {
      downloadBtn.style.display = 'block';
      document.getElementById('card').scrollIntoView({ behavior: 'smooth' });
    }, 200);
  } catch (e) {
    clearInterval(interval);
    overlay.style.display = 'none';
    submitBtn.style.display = 'block';
    errorMsg.textContent = "❌ Failed to remove background.";
  }
}

document.getElementById('downloadMainBtn').onclick = () => {
  const btns = document.getElementById('downloadBtns');
  btns.classList.add('show');
  setTimeout(() => {
    btns.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
};

document.getElementById('downloadPngBtn').onclick = () => {
  const a = document.createElement('a');
  a.href = resultImgUrl;
  a.download = originalFilename + ".png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

document.getElementById('downloadJpgBtn').onclick = () => {
  const img = document.getElementById("previewImage");
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  const jpgURL = canvas.toDataURL("image/jpeg", 1.0);

  const a = document.createElement("a");
  a.href = jpgURL;
  a.download = originalFilename + ".jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
