// tracking.js — ajouté : upload preview, validation et ajout de ligne dynamique + suppression

document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('imageInput');
  const previewImage = document.getElementById('previewImage');
  const uploadBox = document.getElementById('uploadBox');
  const addRowBtn = document.getElementById('addRowBtn');
  const trackingTableBody = document.querySelector('#trackingTable tbody');
  const trackingForm = document.getElementById('trackingForm');

  let currentImageDataUrl = null;

  // Preview image when user selects a file
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Merci de choisir une image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      currentImageDataUrl = reader.result;
      previewImage.src = currentImageDataUrl;
      previewImage.classList.add('visible');
    };
    reader.readAsDataURL(file);
  });

  // Add row to table
  addRowBtn.addEventListener('click', () => {
    const babyName = document.getElementById('babyName').value.trim();
    const babyAge = document.getElementById('babyAge').value.trim();
    const height = document.getElementById('height').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const doctorName = document.getElementById('doctorName').value.trim();
    const doctorPhone = document.getElementById('doctorPhone').value.trim();
    const doctorEmail = document.getElementById('doctorEmail').value.trim();

    // validation minimal
    if (!babyName || !babyAge || !height || !weight) {
      alert('Merci de remplir tous les champs obligatoires (*)');
      return;
    }

    // create row
    const tr = document.createElement('tr');

    // photo cell
    const tdPhoto = document.createElement('td');
    const img = document.createElement('img');
    img.className = 'table-thumb';
    img.alt = babyName + ' photo';
    img.src = currentImageDataUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="100%" height="100%" fill="%23e6e0cf"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="%23808080">No+Image</text></svg>';
    tdPhoto.appendChild(img);
    tr.appendChild(tdPhoto);

    // helper
    function addTd(text){ const td=document.createElement('td'); td.textContent=text; tr.appendChild(td); }

    addTd(babyName);
    addTd(babyAge);
    addTd(height);
    addTd(weight);
    addTd(notes || '—');
    addTd(doctorName || '—');
    addTd(doctorPhone || '—');
    addTd(doctorEmail || '—');

    // actions cell (delete)
    const tdActions = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn';
    delBtn.textContent = 'Supprimer';
    delBtn.addEventListener('click', () => {
      tr.classList.add('removing');
      tr.style.transition = 'opacity 300ms, transform 300ms';
      tr.style.opacity = '0';
      tr.style.transform = 'translateX(-30px)';
      setTimeout(() => tr.remove(), 320);
    });
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    // append row
    trackingTableBody.appendChild(tr);

    // small animation
    tr.style.opacity = '0';
    tr.style.transform = 'translateY(18px)';
    requestAnimationFrame(() => {
      tr.style.transition = 'all 360ms ease';
      tr.style.opacity = '1';
      tr.style.transform = 'none';
    });

    // reset form (but keep preview if user wants)
    trackingForm.reset();
    currentImageDataUrl = null;
    previewImage.src = '';
    previewImage.classList.remove('visible');
  });

  // allow clicking upload box to open file picker
  uploadBox.addEventListener('click', () => imageInput.click());
});

