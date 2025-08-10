// submit-flip-cards.js
// pseudocode: backend handler (Node.js + Express + multer + fs)
// console.log("✅ submit-flip-cards.js loaded");
const serverURL = "http://localhost:3000";
document.getElementById("gallery-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const imageFile = document.getElementById("imageFile").files[0];
  const bioFile = document.getElementById("bioFile").files[0];
  const description = document.getElementById("description").value;
  const name = document.getElementById("name").value;

  // Detect edit mode
  const editIndex = document.getElementById('entry-select')?.value;
  const isEditMode = document.getElementById('edit-select-container')?.style.display === 'block';

  if (!name || !description) {
    alert("Please fill out name and description.");
    return;
  }

  if (!imageFile && !isEditMode) {
    alert("Please upload an image.");
    return;
  }

  if (!bioFile && !isEditMode) {
    alert("Please upload a biography.");
    return;
  }

  const formData = new FormData();
  if (imageFile) formData.append("image", imageFile);
  if (bioFile) formData.append("bio", bioFile);
  formData.append("name", name);
  formData.append("description", description);
  formData.append("editIndex", isEditMode ? editIndex : '');

  try {
    const response = await fetch(`${serverURL}/upload-endpoint`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload/edit failed");
    }

    const result = await response.json();
    alert(result.message || "✅ Entry submitted!");
    console.log(result);
    location.reload();
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert("Something went wrong during submission.");
  }
});