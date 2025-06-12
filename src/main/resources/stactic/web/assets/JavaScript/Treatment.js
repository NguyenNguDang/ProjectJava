// Simulated backend interaction - replace with real API endpoints
const api = {
  createTreatment: async (data) => {
    try {
      const response = await fetch('/treatment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create treatment');
      const result = await response.json();
      saveToLocalStorage('treatments', result);
      return result;
    } catch (error) {
      console.error('Create treatment error:', error);
      throw error;
    }
  },
  getTreatmentsByPatientOrDoctor: async (id) => {
    try {
      const response = await fetch(`/treatment/patient-or-doctor/${id}`);
      if (!response.ok) throw new Error('Failed to fetch treatments');
      const result = await response.json();
      saveToLocalStorage('treatments', result);
      return result;
    } catch (error) {
      console.error('Fetch treatments error:', error);
      return loadFromLocalStorage('treatments') || [];
    }
  },
  getDoctors: async () => {
    try {
      const response = await fetch('/users/doctors');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const result = await response.json();
      saveToLocalStorage('doctors', result);
      return result;
    } catch (error) {
      console.error('Fetch doctors error:', error);
      return loadFromLocalStorage('doctors') || [];
    }
  },
  createAppointment: async (treatmentId, data) => {
    try {
      const response = await fetch(`/treatment/${treatmentId}/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create appointment');
      const result = await response.json();
      saveToLocalStorage('appointments', result);
      return result;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  },
  getAppointments: async (treatmentId) => {
    try {
      const response = await fetch(`/treatment/${treatmentId}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const result = await response.json();
      saveToLocalStorage('appointments', result);
      return result;
    } catch (error) {
      console.error('Fetch appointments error:', error);
      return loadFromLocalStorage('appointments') || [];
    }
  },
  updateAppointment: async (treatmentId, appointmentId, data) => {
    try {
      const response = await fetch(`/treatment/${treatmentId}/appointment/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update appointment');
      const result = await response.json();
      saveToLocalStorage('appointments', result);
      return result;
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  },
  deleteAppointment: async (treatmentId, appointmentId) => {
    try {
      const response = await fetch(`/treatment/${treatmentId}/appointment/${appointmentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      removeFromLocalStorage('appointments', appointmentId);
      return true;
    } catch (error) {
      console.error('Delete appointment error:', error);
      throw error;
    }
  },
  updateTreatment: async (treatmentId, data) => {
    try {
      const response = await fetch(`/treatment/${treatmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update treatment');
      const result = await response.json();
      saveToLocalStorage('treatments', result);
      return result;
    } catch (error) {
      console.error('Update treatment error:', error);
      throw error;
    }
  },
  deleteTreatment: async (treatmentId) => {
    try {
      const response = await fetch(`/treatment/${treatmentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete treatment');
      removeFromLocalStorage('treatments', treatmentId);
      return true;
    } catch (error) {
      console.error('Delete treatment error:', error);
      throw error;
    }
  }
};

// Local Storage for auto-saving
function saveToLocalStorage(key, data) {
  try {
    let existing = loadFromLocalStorage(key) || [];
    if (!Array.isArray(data)) data = [data];
    const updated = [...existing, ...data].filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Local storage is full. Please clear some data.');
    }
    throw e;
  }
}

function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

function removeFromLocalStorage(key, id) {
  let data = loadFromLocalStorage(key) || [];
  data = data.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(data));
}

// Elements
const sectionDoctorSearch = document.getElementById('section-doctor-search');
const doctorListContainer = document.getElementById('doctor-list');
const searchForm = document.getElementById('search-form');
const sectionTreatmentList = document.getElementById('section-treatment-list');
const sectionAppointments = document.getElementById('section-appointments');
const treatmentListContainer = document.getElementById('treatment-list');
const navTreatmentList = document.getElementById('nav-treatment-list');
const navAppointments = document.getElementById('nav-appointments');
const createTreatmentForm = document.getElementById('create-treatment-form');
const addAppointmentForm = document.getElementById('add-appointment-form');
const backToTreatmentsBtn = document.getElementById('back-to-treatments');
const appointmentsTbody = document.getElementById('appointments-tbody');
const tabAppointmentList = document.getElementById('tab-appointment-list');
const tabCalendarView = document.getElementById('tab-calendar-view');
const appointmentListView = document.getElementById('appointment-list');
const calendarView = document.getElementById('calendar-view');
const calendarElement = document.getElementById('calendar');
const appointmentFormTitle = document.getElementById('appointment-form-title');
const appointmentIdInput = document.getElementById('appointment-id');
const appointmentDateInput = document.getElementById('appointment-date');
const appointmentTypeInput = document.getElementById('appointment-type');
const appointmentNotesInput = document.getElementById('appointment-notes');
const submitAppointmentBtn = document.getElementById('submit-appointment');
const cancelEditBtn = document.getElementById('cancel-edit');
const treatmentFormError = document.getElementById('treatment-form-error');

// State
let treatments = loadFromLocalStorage('treatments') || [];
let doctors = loadFromLocalStorage('doctors') || [];
let selectedTreatment = null;
let appointments = loadFromLocalStorage('appointments') || [];
let editingAppointmentId = null;
let calendar;

// Utility Functions
function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
function formatDateISO(date) {
  return date.toISOString().split('T')[0];
}
function parseDateISO(dateString) {
  return new Date(dateString + 'T00:00:00');
}
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Render Functions
function renderDoctorList() {
  clearChildren(doctorListContainer);
  if (doctors.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No doctors found.';
    doctorListContainer.appendChild(emptyMsg);
    return;
  }
  doctors.forEach(d => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
      <strong>${d.name}</strong>
      <small>Doctor ID: ${d.id}</small>
      <small>Specialty: ${d.specialty || 'Not specified'}</small>
    `;
    doctorListContainer.appendChild(card);
  });
}

function renderTreatmentList() {
  clearChildren(treatmentListContainer);
  if (treatments.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No treatment plans found. Please create one or search by ID.';
    treatmentListContainer.appendChild(emptyMsg);
    return;
  }
  treatments.forEach(t => {
    const card = document.createElement('div');
    card.className = 'treatment-card';
    card.dataset.id = t.id;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', selectedTreatment && selectedTreatment.id === t.id ? 'true' : 'false');
    card.innerHTML = `
      <strong>Method: ${t.method}</strong>
      <small>Patient ID: ${t.patient_id}</small>
      <small>Doctor ID: ${t.doctor_id}</small>
      <small>Service ID: ${t.service_id}</small>
      <small>Start Date: ${t.start_date}</small>
      <small>Status: ${t.status}</small>
      <div class="inline-flex" style="margin-top: 0.5rem; gap: 0.5rem;">
        <button class="action-btn" aria-label="Edit treatment ${t.id}">Edit</button>
        <button class="action-btn delete" aria-label="Delete treatment ${t.id}">Delete</button>
      </div>
    `;
    if (selectedTreatment && t.id === selectedTreatment.id) {
      card.classList.add('selected');
    }
    treatmentListContainer.appendChild(card);
  });
}

async function loadTreatmentsForPatientOrDoctor(id) {
  if (!id || id <= 0) {
    treatmentFormError.textContent = 'Please enter a valid ID';
    treatmentFormError.style.display = 'block';
    return;
  }
  treatments = await api.getTreatmentsByPatientOrDoctor(id);
  selectedTreatment = null;
  renderTreatmentList();
  showSection('treatment-list');
  navTreatmentList.classList.add('active');
  navAppointments.classList.remove('active');
  navAppointments.setAttribute('aria-disabled', 'true');
  navAppointments.tabIndex = -1;
}

async function loadDoctors() {
  doctors = await api.getDoctors();
  renderDoctorList();
}

function showSection(section) {
  if (section === 'doctor-search') {
    sectionDoctorSearch.hidden = false;
    sectionTreatmentList.hidden = true;
    sectionAppointments.hidden = true;
  } else if (section === 'treatment-list') {
    sectionDoctorSearch.hidden = false;
    sectionTreatmentList.hidden = false;
    sectionAppointments.hidden = true;
  } else if (section === 'appointments') {
    sectionDoctorSearch.hidden = false;
    sectionTreatmentList.hidden = true;
    sectionAppointments.hidden = false;
  }
}

async function selectTreatment(treatmentId) {
  selectedTreatment = treatments.find(t => t.id === treatmentId);
  if (!selectedTreatment) return;
  navTreatmentList.classList.remove('active');
  navAppointments.classList.add('active');
  navAppointments.removeAttribute('aria-disabled');
  navAppointments.tabIndex = 0;
  await loadAppointments(treatmentId);
  showSection('appointments');
}

async function loadAppointments(treatmentId) {
  appointments = await api.getAppointments(treatmentId);
  renderAppointments();
  renderCalendar();
}

function renderAppointments() {
  clearChildren(appointmentsTbody);
  if (appointments.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" style="text-align:center; padding: 1rem;">No appointments found.</td>`;
    appointmentsTbody.appendChild(tr);
    return;
  }
  appointments.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.appointment_date}</td>
      <td>${a.appointment_type}</td>
      <td>${a.notes || '-'}</td>
      <td>
        <div class="inline-flex" style="gap: 0.5rem;">
          <button class="action-btn" onclick="editAppointment(${a.id})" aria-label="Edit appointment ${a.id}">Edit</button>
          <button class="action-btn delete" onclick="deleteAppointment(${a.id})" aria-label="Delete appointment ${a.id}">Delete</button>
        </div>
      </td>
    `;
    appointmentsTbody.appendChild(tr);
  });
}

// Calendar Initialization with FullCalendar
function renderCalendar() {
  if (calendar) {
    calendar.destroy();
  }
  calendar = new FullCalendar.Calendar(calendarElement, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: appointments.map(a => ({
      title: a.appointment_type,
      start: a.appointment_date,
      extendedProps: {
        notes: a.notes
      }
    })),
    eventClick: function(info) {
      alert(`Appointment: ${info.event.title}\nDate: ${info.event.start.toDateString()}\nNotes: ${info.event.extendedProps.notes || 'No notes'}`);
    }
  });
  calendar.render();
}

// Treatment CRUD
async function editTreatment(treatmentId) {
  const treatment = treatments.find(t => t.id === treatmentId);
  if (!treatment) return;
  document.getElementById('patient-id').value = treatment.patient_id;
  document.getElementById('doctor-id').value = treatment.doctor_id;
  document.getElementById('service-id').value = treatment.service_id;
  document.getElementById('method').value = treatment.method;
  document.getElementById('start-date').value = treatment.start_date;
  document.getElementById('status').value = treatment.status;
  createTreatmentForm.onsubmit = async (e) => {
    e.preventDefault();
    treatmentFormError.style.display = 'none';
    const formData = new FormData(createTreatmentForm);
    const data = {
      patient_id: Number(formData.get('patient_id')),
      doctor_id: Number(formData.get('doctor_id')),
      service_id: Number(formData.get('service_id')),
      method: formData.get('method').trim(),
      start_date: formData.get('start_date'),
      status: formData.get('status'),
    };
    if (data.patient_id <= 0 || !Number.isInteger(data.patient_id)) {
      treatmentFormError.textContent = 'Invalid Patient ID';
      treatmentFormError.style.display = 'block';
      return;
    }
    if (data.doctor_id <= 0 || !Number.isInteger(data.doctor_id)) {
      treatmentFormError.textContent = 'Invalid Doctor ID';
      treatmentFormError.style.display = 'block';
      return;
    }
    if (data.method.length < 3) {
      treatmentFormError.textContent = 'Method must be at least 3 characters long';
      treatmentFormError.style.display = 'block';
      return;
    }
    try {
      const updatedTreatment = await api.updateTreatment(treatmentId, data);
      const index = treatments.findIndex(t => t.id === treatmentId);
      treatments[index] = updatedTreatment;
      saveToLocalStorage('treatments', treatments);
      renderTreatmentList();
      createTreatmentForm.reset();
      createTreatmentForm.onsubmit = createTreatmentHandler;
      alert('Treatment plan updated.');
    } catch (error) {
      treatmentFormError.textContent = error.message || 'Failed to update treatment plan.';
      treatmentFormError.style.display = 'block';
    }
  };
}

async function deleteTreatment(treatmentId) {
  if (!confirm('Are you sure you want to delete this treatment plan?')) return;
  try {
    await api.deleteTreatment(treatmentId);
    treatments = treatments.filter(t => t.id !== treatmentId);
    saveToLocalStorage('treatments', treatments);
    selectedTreatment = null;
    renderTreatmentList();
    showSection('treatment-list');
    navTreatmentList.classList.add('active');
    navAppointments.classList.remove('active');
    navAppointments.setAttribute('aria-disabled', 'true');
    navAppointments.tabIndex = -1;
    appointments = [];
    clearChildren(appointmentsTbody);
    alert('Treatment plan deleted.');
  } catch (error) {
    alert('Failed to delete treatment plan.');
  }
}

// Appointment CRUD
function editAppointment(appointmentId) {
  const appointment = appointments.find(a => a.id === appointmentId);
  if (!appointment) return;
  editingAppointmentId = appointmentId;
  appointmentIdInput.value = appointmentId;
  appointmentDateInput.value = appointment.appointment_date;
  appointmentTypeInput.value = appointment.appointment_type;
  appointmentNotesInput.value = appointment.notes || '';
  appointmentFormTitle.textContent = 'Edit Appointment';
  submitAppointmentBtn.textContent = 'Update';
  cancelEditBtn.hidden = false;
}

async function deleteAppointment(appointmentId) {
  if (!confirm('Are you sure you want to delete this appointment?')) return;
  try {
    await api.deleteAppointment(selectedTreatment.id, appointmentId);
    appointments = appointments.filter(a => a.id !== appointmentId);
    renderAppointments();
    renderCalendar();
    alert('Appointment deleted.');
  } catch (error) {
    alert('Failed to delete appointment.');
  }
}

// Tabs for appointments view
tabAppointmentList.addEventListener('click', () => {
  setActiveTab('list');
});

tabCalendarView.addEventListener('click', () => {
  setActiveTab('calendar');
});

function setActiveTab(tab) {
  if (tab === 'list') {
    tabAppointmentList.classList.add('active');
    tabAppointmentList.setAttribute('aria-selected', 'true');
    tabAppointmentList.tabIndex = 0;
    tabCalendarView.classList.remove('active');
    tabCalendarView.setAttribute('aria-selected', 'false');
    tabCalendarView.tabIndex = -1;
    appointmentListView.hidden = false;
    calendarView.hidden = true;
  } else {
    tabAppointmentList.classList.remove('active');
    tabAppointmentList.setAttribute('aria-selected', 'false');
    tabAppointmentList.tabIndex = -1;
    tabCalendarView.classList.add('active');
    tabCalendarView.setAttribute('aria-selected', 'true');
    tabCalendarView.tabIndex = 0;
    appointmentListView.hidden = true;
    calendarView.hidden = false;
  }
}

// Event handlers
const createTreatmentHandler = async (e) => {
  e.preventDefault();
  treatmentFormError.style.display = 'none';
  const btn = document.getElementById('create-treatment-btn');
  btn.disabled = true;
  btn.textContent = 'Creating...';
  const formData = new FormData(createTreatmentForm);
  const data = {
    patient_id: Number(formData.get('patient_id')),
    doctor_id: Number(formData.get('doctor_id')),
    service_id: Number(formData.get('service_id')),
    method: formData.get('method').trim(),
    start_date: formData.get('start_date'),
    status: formData.get('status'),
  };
  if (data.patient_id <= 0 || !Number.isInteger(data.patient_id)) {
    treatmentFormError.textContent = 'Invalid Patient ID';
    treatmentFormError.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Create';
    return;
  }
  if (data.doctor_id <= 0 || !Number.isInteger(data.doctor_id)) {
    treatmentFormError.textContent = 'Invalid Doctor ID';
    treatmentFormError.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Create';
    return;
  }
  if (data.method.length < 3) {
    treatmentFormError.textContent = 'Method must be at least 3 characters long';
    treatmentFormError.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Create';
    return;
  }
  try {
    const newTreatment = await api.createTreatment(data);
    treatments.push(newTreatment);
    saveToLocalStorage('treatments', newTreatment);
    selectedTreatment = newTreatment;
    renderTreatmentList();
    await selectTreatment(newTreatment.id);
    createTreatmentForm.reset();
    alert('New treatment plan created and selected.');
  } catch (error) {
    treatmentFormError.textContent = error.message || 'Failed to create treatment plan.';
    treatmentFormError.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create';
  }
};

createTreatmentForm.addEventListener('submit', createTreatmentHandler);

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(searchForm);
  const searchId = Number(formData.get('search_id'));
  await loadTreatmentsForPatientOrDoctor(searchId);
});

addAppointmentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedTreatment) {
    alert('Please select a treatment plan first.');
    return;
  }
  const formData = new FormData(addAppointmentForm);
  const data = {
    appointment_date: formData.get('appointment_date'),
    appointment_type: formData.get('appointment_type').trim(),
    notes: formData.get('notes').trim(),
  };
  if (!data.appointment_date) {
    alert('Please provide a valid appointment date.');
    return;
  }
  if (data.appointment_type.length < 3) {
    alert('Appointment type must be at least 3 characters long.');
    return;
  }
  try {
    if (editingAppointmentId) {
      const updatedAppointment = await api.updateAppointment(selectedTreatment.id, editingAppointmentId, data);
      const index = appointments.findIndex(a => a.id === editingAppointmentId);
      appointments[index] = updatedAppointment;
      saveToLocalStorage('appointments', updatedAppointment);
      alert('Appointment updated.');
    } else {
      const newAppointment = await api.createAppointment(selectedTreatment.id, data);
      appointments.push(newAppointment);
      saveToLocalStorage('appointments', newAppointment);
      alert('Appointment added.');
    }
    renderAppointments();
    renderCalendar();
    addAppointmentForm.reset();
    appointmentFormTitle.textContent = 'Add New Appointment';
    submitAppointmentBtn.textContent = 'Add Appointment';
    cancelEditBtn.hidden = true;
    editingAppointmentId = null;
  } catch (error) {
    alert(editingAppointmentId ? 'Failed to update appointment.' : 'Failed to add appointment.');
  }
});

cancelEditBtn.addEventListener('click', () => {
  addAppointmentForm.reset();
  appointmentFormTitle.textContent = 'Add New Appointment';
  submitAppointmentBtn.textContent = 'Add Appointment';
  cancelEditBtn.hidden = true;
  editingAppointmentId = null;
});

backToTreatmentsBtn.addEventListener('click', () => {
  showSection('treatment-list');
  navTreatmentList.classList.add('active');
  navAppointments.classList.remove('active');
  navAppointments.setAttribute('aria-disabled', 'true');
  navAppointments.tabIndex = -1;
  selectedTreatment = null;
  renderTreatmentList();
  appointments = [];
  clearChildren(appointmentsTbody);
});

navTreatmentList.addEventListener('click', (e) => {
  e.preventDefault();
  showSection('treatment-list');
  navTreatmentList.classList.add('active');
  navAppointments.classList.remove('active');
  navAppointments.setAttribute('aria-disabled', 'true');
  navAppointments.tabIndex = -1;
  selectedTreatment = null;
  renderTreatmentList();
  appointments = [];
  clearChildren(appointmentsTbody);
});

navAppointments.addEventListener('click', async (e) => {
  e.preventDefault();
  if (navAppointments.getAttribute('aria-disabled') === 'true') return;
  if (!selectedTreatment) return;
  await loadAppointments(selectedTreatment.id);
  showSection('appointments');
  navTreatmentList.classList.remove('active');
  navAppointments.classList.add('active');
});

treatmentListContainer.addEventListener('click', (e) => {
  const treatmentId = Number(e.target.closest('.treatment-card')?.dataset.id);
  if (!treatmentId) return;
  if (e.target.classList.contains('action-btn')) {
    if (e.target.textContent === 'Edit') {
      editTreatment(treatmentId);
    } else if (e.target.textContent === 'Delete') {
      deleteTreatment(treatmentId);
    }
  } else {
    selectTreatment(treatmentId);
  }
});

treatmentListContainer.addEventListener('keydown', (e) => {
  const treatmentId = Number(e.target.closest('.treatment-card')?.dataset.id);
  if (!treatmentId) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectTreatment(treatmentId);
  }
});

// Auto-save form inputs
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
  input.addEventListener('input', debounce(() => {
    const form = input.closest('form');
    const formId = form.id;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    saveToLocalStorage(`form-${formId}`, data);
  }, 300));
});

// Load saved form data
function loadFormData() {
  const treatmentFormData = loadFromLocalStorage('form-create-treatment-form');
  if (treatmentFormData) {
    Object.keys(treatmentFormData).forEach(key => {
      const element = document.getElementById(key);
      if (element) element.value = treatmentFormData[key];
    });
  }
  const appointmentFormData = loadFromLocalStorage('form-add-appointment-form');
  if (appointmentFormData) {
    Object.keys(appointmentFormData).forEach(key => {
      const element = document.getElementById(key);
      if (element) element.value = appointmentFormData[key];
    });
  }
  const searchFormData = loadFromLocalStorage('form-search-form');
  if (searchFormData) {
    Object.keys(searchFormData).forEach(key => {
      const element = document.getElementById(key);
      if (element) element.value = searchFormData[key];
    });
  }
}

// Initial load
loadFormData();
renderTreatmentList();
loadDoctors();