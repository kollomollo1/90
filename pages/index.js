
import React, { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    // Add all the existing JavaScript functions here
    let isAdmin = false;
    const galleryEl = document.getElementById("gallery");
    const scrollBtn = document.getElementById("scrollTopBtn");
    const categorySelect = document.getElementById("categorySelect");
    const categoryFilter = document.getElementById("categoryFilter");
    let images = [];
    let page = 1;
    const pageSize = 20;

    // Update Counter
    function updateCounter() {
      document.getElementById("imageCount").textContent = getFilteredImages().length;
    }

    // Get Filtered Images
    function getFilteredImages() {
      const selectedCategory = categoryFilter.value;
      return selectedCategory === "all" ? images : images.filter(i => i.category === selectedCategory);
    }

    // Render Chunk
    function renderChunk() {
      const filtered = getFilteredImages();
      const chunk = filtered.slice((page - 1) * pageSize, page * pageSize);
      const grouped = {};
      chunk.forEach(img => {
        if (!grouped[img.group]) grouped[img.group] = [];
        grouped[img.group].push(img);
      });

      Object.values(grouped).forEach(groupImgs => {
        const img = groupImgs[0];
        const div = document.createElement("div");
        div.className = "square";

        const image = document.createElement("img");
        image.src = img.src;
        image.onclick = e => {
          e.stopPropagation();
          openLightbox(groupImgs.map(i => i.src), img.category);
        };
        div.appendChild(image);

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = img.category || "";
        div.appendChild(label);

        if (isAdmin) {
          const delBtn = document.createElement("div");
          delBtn.textContent = "✖";
          delBtn.style.cssText = `
            position: absolute; top: 4px; right: 4px;
            background: rgba(0,0,0,0.6); color: white;
            font-size: 14px; width: 20px; height: 20px;
            line-height: 20px; text-align: center;
            border-radius: 50%; cursor: pointer; z-index: 10;
          `;
          delBtn.onclick = e => {
            e.stopPropagation();
            images = images.filter(i => i.id !== img.id);
            localStorage.setItem("gallery_images", JSON.stringify(images));
            galleryEl.innerHTML = "";
            page = 1;
            renderChunk();
            updateCounter();
          };
          div.appendChild(delBtn);
        }

        galleryEl.appendChild(div);
      });
    }

    // Open Lightbox
    function openLightbox(imgArray, category) {
      currentLightboxImages = imgArray;
      currentLightboxIndex = 0;
      showLightboxImage();
      document.getElementById("lightbox").style.display = "flex";
      document.getElementById("lightbox-category").textContent = category || "";
      document.getElementById("lightbox-img").onclick = e => {
        e.stopPropagation();
      };

      const leftArrow = document.querySelector("#lightbox button:nth-of-type(1)");
      const rightArrow = document.querySelector("#lightbox button:nth-of-type(2)");
      if (imgArray.length <= 1) {
        leftArrow.style.display = "none";
        rightArrow.style.display = "none";
      } else {
        leftArrow.style.display = "block";
        rightArrow.style.display = "block";
      }
    }

    // Show Lightbox Image
    function showLightboxImage() {
      document.getElementById("lightbox-img").src = currentLightboxImages[currentLightboxIndex];
    }

    // Next Image
    function nextImage() {
      if (currentLightboxIndex < currentLightboxImages.length - 1) {
        currentLightboxIndex++;
        showLightboxImage();
      }
    }

    // Previous Image
    function prevImage() {
      if (currentLightboxIndex > 0) {
        currentLightboxIndex--;
        showLightboxImage();
      }
    }

    // Handle Upload
    function handleUpload(files) {
      const selectedCategory = categorySelect.value;
      if (!selectedCategory) return alert("اختر تصنيفًا أولاً");
      const newImgs = [];
      let loaded = 0;
      const groupId = Date.now();
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          newImgs.push({ id: Date.now() + Math.random(), src: e.target.result, category: selectedCategory, group: groupId });
          loaded++;
          if (loaded === files.length) {
            const stored = JSON.parse(localStorage.getItem("gallery_images") || "[]");
            const updated = [...newImgs, ...stored];
            localStorage.setItem("gallery_images", JSON.stringify(updated));
            images = updated;
            galleryEl.innerHTML = "";
            page = 1;
            renderChunk();
            updateCounter();
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Clear Gallery
    function confirmClearGallery() {
      if (confirm("هل أنت متأكد أنك تريد حذف جميع الصور؟")) {
        localStorage.removeItem("gallery_images");
        images = [];
        galleryEl.innerHTML = "";
        page = 1;
        updateCounter();
      }
    }

    // Shuffle Gallery
    function shuffleGallery() {
      images = images.sort(() => Math.random() - 0.5);
      localStorage.setItem("gallery_images", JSON.stringify(images));
      galleryEl.innerHTML = "";
      page = 1;
      renderChunk();
      updateCounter();
    }

    // Scroll to Top
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Ask Admin
    function askAdmin() {
      const user = prompt("اسم المستخدم:");
      const pass = prompt("كلمة السر:");
      if (user === "2330498Aa" && pass === "2330498Aa") {
        document.getElementById("adminPanel").style.display = "flex";
        isAdmin = true;
        galleryEl.innerHTML = "";
        page = 1;
        renderChunk();
        updateCounter();
      } else {
        alert("بيانات الدخول غير صحيحة");
      }
    }

    // Initialize Gallery
    const stored = JSON.parse(localStorage.getItem("gallery_images") || "[]");
    images = stored;
    renderChunk();
    updateCounter();
  }, []);

  return (
    <>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>معرض الصور</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet" />
        <style>
          {`
            /* Your styles here */
          `}
        </style>
      </head>
      <body>
        {/* Add your HTML structure here */}
        {/* All your HTML content goes here */}
      </body>
    </>
  );
};

export default HomePage;
