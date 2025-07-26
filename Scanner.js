document.addEventListener("DOMContentLoaded", function () {
  const scannerSection = document.getElementById("scener");

  if (!scannerSection) return;

  const imageInput = scannerSection.querySelector("#imageInput");
  const previewImage = scannerSection.querySelector("#previewImage");
  const scannerLine1 = scannerSection.querySelector("#scannerLine1");
  const scannerLine2 = scannerSection.querySelector("#scannerLine2");
  const scanBtn = scannerSection.querySelector("#scanBtn");
  const downloadNow = scannerSection.querySelector("#downloadNow");
  const resolutionOptions = scannerSection.querySelector("#resolutionOptions");

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        scanBtn.classList.remove("hidden");
        downloadNow.classList.add("hidden");
        resolutionOptions.classList.add("hidden");

        // স্ক্যান বাটন দৃশ্যমান হওয়ার পরে স্ক্রল
        setTimeout(() => {
          scanBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
      };
      reader.readAsDataURL(file);
    }
  });

  scanBtn.addEventListener("click", () => {
    scanBtn.classList.add("hidden");

    scannerLine1.style.display = "block";
    scannerLine1.style.animation = "scanLine 3s ease-in-out";

    setTimeout(() => {
      scannerLine1.style.display = "none";

      scannerLine2.style.display = "block";
      scannerLine2.style.animation = "scanLine 3s ease-in-out";

      setTimeout(() => {
        scannerLine2.style.display = "none";
        applySmartEnhancement();
        downloadNow.classList.remove("hidden");

        // ডাউনলোড বাটন দৃশ্যমান হওয়ার পরে স্ক্রল
        setTimeout(() => {
          downloadNow.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
      }, 3000);
    }, 3000);
  });

  downloadNow.addEventListener("click", () => {
    resolutionOptions.classList.remove("hidden");

    // রেজোলিউশন বাটন দৃশ্যমান হওয়ার পরে স্ক্রল
    setTimeout(() => {
      resolutionOptions.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  });

  const resButtons = scannerSection.querySelectorAll(".res-btn");

  resButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const size = parseInt(btn.getAttribute("data-size"));
      const img = new Image();
      img.src = previewImage.src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const aspect = img.width / img.height;
        canvas.width = size;
        canvas.height = size / aspect;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `scanned-${size}px.png`;
        link.click();
      };
    });
  });

  function applySmartEnhancement() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = previewImage.src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.2);       // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.2); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.2); // Blue
      }

      ctx.putImageData(imageData, 0, 0);
      previewImage.src = canvas.toDataURL("image/png");
    };
  }
});
