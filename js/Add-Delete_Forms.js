// Add-Delete_Forms.js
// This script controls the display of the Add-Edit and Delete forms


document.addEventListener("DOMContentLoaded", () => {
  // 📸 Add / Edit Entry Form
  const form = document.getElementById('gallery-form');
  const openAddBtn = document.getElementById('open-add-form-btn');
  const openEditBtn = document.getElementById('open-edit-form-btn');
  const editSelectContainer = document.getElementById('edit-select-container');
  const entrySelect = document.getElementById('entry-select');
  const cancelBtn = document.getElementById('cancelBtn');
  const serverURL = 'http://localhost:3000';

  let currentEditIndex = null;

  openAddBtn.addEventListener('click', () => {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    editSelectContainer.style.display = 'none';
    currentEditIndex = null;
    form.reset();
  });

  openEditBtn.addEventListener('click', () => {
    const isHidden = form.style.display === 'none';
    form.style.display = isHidden ? 'block' : 'none';
    editSelectContainer.style.display = isHidden ? 'block' : 'none';

    if (isHidden) {
      currentEditIndex = null;
      form.reset();

      fetch('/flip-card-data.json')
        .then(res => res.json())
        .then(data => {
          entrySelect.innerHTML = '';
          data.forEach((entry, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = entry.name || `Entry ${index + 1}`;
            entrySelect.appendChild(option);
          });
        });
    }
  });

  entrySelect.addEventListener('change', () => {
    const selectedIndex = entrySelect.value;
    currentEditIndex = selectedIndex;

    fetch('/flip-card-data.json')
      .then(res => res.json())
      .then(data => {
        const entry = data[selectedIndex];
        document.getElementById('name').value = entry.name || '';
        document.getElementById('description').value = entry.description || '';
        document.getElementById('imageFile').value = '';
        document.getElementById('bioFile').value = '';
      });
  });

  cancelBtn.addEventListener('click', () => {
    form.style.display = 'none';
    editSelectContainer.style.display = 'none';
    form.reset();
    currentEditIndex = null;
  });

  // 🗑️ Delete Entry Form (container removed)
  const deleteForm = document.getElementById('delete-form');
  const openDeleteBtn = document.getElementById('open-delete-form-btn');
  const deleteCancelBtn = document.getElementById('deleteCancelBtn');

  openDeleteBtn.addEventListener('click', () => {
    deleteForm.style.display = deleteForm.style.display === 'none' ? 'block' : 'none';

    fetch('/flip-card-data.json')
      .then(res => res.json())
      .then(data => {
        const deleteSelect = document.getElementById('name-select');
        deleteSelect.innerHTML = '';
        data.forEach((entry, index) => {
          const option = document.createElement('option');
          option.value = index;
          option.textContent = entry.name;
          deleteSelect.appendChild(option);
        });
      })
      .catch(err => {
        console.error('❌ Failed to load flip-card-data.json for deletion:', err);
      });
  });

  deleteCancelBtn.addEventListener('click', () => {
    deleteForm.style.display = 'none';
    deleteForm.reset();
  });

  deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedIndex = document.getElementById('name-select').selectedIndex;
    const password = document.getElementById('delete-password').value;
    const selectedOption = document.getElementById('name-select').options[selectedIndex];
    const selectedName = selectedOption.textContent;

    const confirmDelete = confirm(`Are you sure you want to delete "${selectedName}"?`);
    if (!confirmDelete) return;

    const res = await fetch(`${serverURL}/delete-entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: selectedIndex, password })
    });

    const result = await res.json();
    alert(result.message || 'No response');
    if (res.ok) location.reload();
  });
});