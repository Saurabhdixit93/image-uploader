// Function to handle file selection and preview
function handleFileSelect(event) {
    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = "";
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement("img");
        img.classList.add("preview-img");
        img.src = e.target.result;
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-sm", "btn-danger" ,"mt-2");
        removeBtn.innerText = "Remove";
        removeBtn.addEventListener("click", function() {
          previewContainer.removeChild(img);
          previewContainer.removeChild(removeBtn);
          const fileInput = document.getElementById("photo");
          fileInput.value = "";
        });
        previewContainer.appendChild(img);
        previewContainer.appendChild(removeBtn);
      };
      
      reader.readAsDataURL(file);
    }
  }
    const fileInput = document.getElementById("photo");
    fileInput.addEventListener("change", handleFileSelect);