class YouTubeThumbnail {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupPlaceholder();
  }

  bindEvents() {
    // Button event listeners
    document
      .querySelectorAll(".buttons button[data-type]")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          const type = e.target.getAttribute("data-type");
          this.dynamicUrl(type);
        });
      });

    // Download button
    document.getElementById("download-btn").addEventListener("click", () => {
      this.download();
    });

    // Full page overlay
    document.getElementById("fullpage").addEventListener("click", () => {
      this.closeFullPage();
    });

    // Image click for full page
    document.getElementById("img").addEventListener("click", () => {
      this.fullPage();
    });

    // Enter key support for input
    document.getElementById("url").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.dynamicUrl("default");
      }
    });

    // Input validation
    document.getElementById("url").addEventListener("input", (e) => {
      this.clearError();
    });
  }

  setupPlaceholder() {
    const urlInput = document.getElementById("url");
    const placeholder = "https://www.youtube.com/watch?v=k8mOAV0KJLE";

    urlInput.addEventListener("focus", () => {
      if (urlInput.value === placeholder) {
        urlInput.value = "";
      }
    });

    urlInput.addEventListener("blur", () => {
      if (urlInput.value === "") {
        urlInput.value = placeholder;
      }
    });
  }

  extractVideoId(url) {
    const regex =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|shorts\/|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    const match = url.match(regex);

    if (!match || !match[6]) {
      this.showError(
        "Invalid YouTube URL. Please check the URL and try again."
      );
      return null;
    }

    return match[6];
  }

  dynamicUrl(type) {
    const url = document.getElementById("url").value.trim();

    if (!url) {
      this.showError("Please enter a YouTube URL.");
      return;
    }

    const videoId = this.extractVideoId(url);
    if (!videoId) return;

    this.showLoading(true);

    let imgUrl;
    switch (type) {
      case "maxres":
        imgUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        break;
      case "webp":
        imgUrl = `https://img.youtube.com/vi_webp/${videoId}/maxresdefault.webp`;
        break;
      default:
        imgUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    this.updateImage(imgUrl, videoId);
  }

  updateImage(imgUrl, videoId) {
    const img = document.getElementById("img");
    const originalSrc = img.src;

    // Create a new image to test if it loads successfully
    const testImg = new Image();

    testImg.onload = () => {
      img.src = imgUrl;
      img.alt = `YouTube thumbnail for video ${videoId}`;
      this.showLoading(false);
      this.clearError();
    };

    testImg.onerror = () => {
      // Fallback to default quality if maxres doesn't exist
      if (imgUrl.includes("maxresdefault")) {
        const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        this.updateImage(fallbackUrl, videoId);
      } else {
        this.showError(
          "Failed to load thumbnail. The video might not exist or the URL might be incorrect."
        );
        this.showLoading(false);
      }
    };

    testImg.src = imgUrl;

    // Set timeout for image loading
    setTimeout(() => {
      if (!testImg.complete) {
        testImg.src = "";
      }
    }, 10000);
  }

  fullPage() {
    const fullPage = document.getElementById("fullpage");
    const imgSrc = document.getElementById("img").src;

    if (imgSrc && !imgSrc.includes("undefined")) {
      fullPage.style.backgroundImage = `url('${imgSrc}')`;
      fullPage.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  }

  closeFullPage() {
    const fullPage = document.getElementById("fullpage");
    fullPage.style.display = "none";
    document.body.style.overflow = "auto";
  }

  download() {
    const imgSrc = document.getElementById("img").src;

    if (!imgSrc || imgSrc.includes("undefined")) {
      this.showError(
        "No thumbnail available to download. Please generate a thumbnail first."
      );
      return;
    }

    try {
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = imgSrc;

      // Extract filename from URL or use default
      const videoId =
        this.extractVideoId(document.getElementById("url").value) ||
        "thumbnail";
      const isWebP = imgSrc.includes(".webp");
      link.download = `youtube-thumbnail-${videoId}.${isWebP ? "webp" : "jpg"}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      this.showError("Download failed. Please try again.");
      console.error("Download error:", error);
    }
  }

  showLoading(show) {
    const buttons = document.querySelectorAll(".buttons button");
    const img = document.getElementById("img");

    if (show) {
      buttons.forEach((btn) => btn.classList.add("loading"));
      img.style.opacity = "0.7";
    } else {
      buttons.forEach((btn) => btn.classList.remove("loading"));
      img.style.opacity = "1";
    }
  }

  showError(message) {
    let errorDiv = document.querySelector(".error-message");

    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      document.querySelector(".input-section").appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }

  clearError() {
    const errorDiv = document.querySelector(".error-message");
    if (errorDiv) {
      errorDiv.style.display = "none";
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new YouTubeThumbnail();
});

// Add error handling for uncaught errors
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error);
});
