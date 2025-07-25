let currentCanvas = null;
let qrCount = 0;
const FREE_LIMIT = 10;
let soundUnlocked = false;
let isMuted = false;

const clickSound = document.getElementById("clickSound");
const typeSound = document.getElementById("typeSound");
const downloadSound = document.getElementById("downloadSound");
const muteBtn = document.getElementById("muteBtn");

document.addEventListener("click", unlockSound, { once: true });
document.addEventListener("touchstart", unlockSound, { once: true });

function unlockSound() {
  [clickSound, typeSound, downloadSound].forEach(a => {
    a.play().catch(() => {});
    a.pause();
    a.currentTime = 0;
  });
  soundUnlocked = true;
}

function play(soundEl) {
  if (!soundUnlocked || isMuted || !soundEl) return;
  try {
    soundEl.pause();
    soundEl.currentTime = 0;
    soundEl.play().catch(() => {});
  } catch {}
}

function playClick() { play(clickSound); }
function playTyping() { play(typeSound); }
function playDownload() { play(downloadSound); }

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
  playClick();
});

let typingTimeout;
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener("input", () => {
      if (typingTimeout) return;
      playTyping();
      typingTimeout = setTimeout(() => {
        typingTimeout = null;
      }, 100);
    });
  });
});

function showInterlinkPopup() {
  const popup = document.getElementById("interlinkPopup");
  popup.style.display = "block";
  popup.classList.remove("animate");
  void popup.offsetWidth;
  popup.classList.add("animate");
  setTimeout(() => { popup.style.display = "none"; }, 2500);
}

function generateQRCode() {
  const link = document.getElementById("linkInput").value.trim();
  const description = document.getElementById("descInput").value.trim();
  const container = document.getElementById("qrCodeContainer");
  const downloadBtn = document.getElementById("downloadBtn");
  const formatOptions = document.getElementById("formatOptions");

  if (!link) {
    showInterlinkPopup();
    return;
  }

  container.innerHTML = "";
  downloadBtn.style.display = "none";
  formatOptions.classList.remove("show");

  if (qrCount >= FREE_LIMIT) {
    document.getElementById("popup").style.display = "flex";
    return;
  }

  const canvas = document.createElement("canvas");

  QRCode.toCanvas(canvas, link, {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'H',
    scale: 6,
    color: {
      dark: '#000000',
      light: '#0000'
    }
  }, function (error) {
    if (error) {
      console.error(error);
      alert("QR Code generate করতে সমস্যা হচ্ছে।");
      return;
    }

    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";

    container.appendChild(canvas);
    currentCanvas = canvas;

    if (description) {
      const desc = document.createElement("p");
      desc.className = "description-text";
      desc.textContent = description;
      container.appendChild(desc);
    }

    downloadBtn.style.display = "block";
    qrCount++;
    updateCounter();

    // ✅ Gentle scroll for both desktop & mobile to bring download button into view
    setTimeout(() => {
      downloadBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  });
}

function updateCounter() {
  const counter = document.getElementById("counterInfo");
  const remaining = FREE_LIMIT - qrCount;
  if (remaining > 0) {
    counter.textContent = `You have ${remaining} free QR code${remaining > 1 ? 's' : ''} remaining.`;
  } else {
    counter.textContent = "Free QR code limit reached.";
  }
}

function showFormats() {
  const formatOptions = document.getElementById("formatOptions");
  formatOptions.classList.remove("show");
  void formatOptions.offsetWidth;
  formatOptions.classList.add("show");
}

function downloadFormat(format) {
  const link = document.getElementById("linkInput").value.trim();
  if (!currentCanvas || !link) return;

  if (format === "svg") {
    QRCode.toString(link, { type: 'svg' }, function (err, svgString) {
      if (err) {
        alert("SVG generate করতে সমস্যা হচ্ছে।");
        return;
      }
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, "qrcode.svg");
      URL.revokeObjectURL(url);
    });
  } else if (format === "png") {
    QRCode.toDataURL(link, {
      width: 300,
      margin: 2,
      scale: 6,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#0000'
      }
    }, function (err, dataURL) {
      if (err) {
        alert("PNG generate করতে সমস্যা হচ্ছে।");
        return;
      }
      triggerDownload(dataURL, "qrcode.png");
    });
  } else if (format === "jpg") {
    const jpgCanvas = document.createElement("canvas");
    const ctx = jpgCanvas.getContext("2d");
    jpgCanvas.width = currentCanvas.width;
    jpgCanvas.height = currentCanvas.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
    ctx.drawImage(currentCanvas, 0, 0);

    const dataURL = jpgCanvas.toDataURL("image/jpeg", 1.0);
    triggerDownload(dataURL, "qrcode.jpg");
  }
}

function triggerDownload(dataURL, filename) {
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  playDownload();
}

function showPaymentForm() {
  const form = document.getElementById("paymentForm");
  form.style.display = (form.style.display === "none" || form.style.display === "") ? "block" : "none";
}

function processPayment() {
  alert("Payment processing is not implemented in this demo.");
}
