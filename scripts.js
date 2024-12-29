const GOAL = 1000;
const QURAN_GOAL = 4;
const INCREMENT = 33;
const QURAN_INCREMENT = 1;

let counts = {
  1: parseInt(localStorage.getItem("counter1")) || 0,
  2: parseInt(localStorage.getItem("counter2")) || 0,
  3: parseInt(localStorage.getItem("counter3")) || 0,
};

let currentCounterToReset = null;
const modal = document.getElementById('resetConfirmModal');
const confirmBtn = document.getElementById('confirmReset');
const cancelBtn = document.getElementById('cancelReset');

// إضافة مستمعي الأحداث للأزرار
confirmBtn.onclick = function() {
  if (currentCounterToReset !== null) {
    if (currentCounterToReset.toString().startsWith('custom_')) {
      // إعادة تعيين العداد المخصص
      customCounters[currentCounterToReset].count = 0;
      saveCustomCounters();
      updateCustomDisplay(currentCounterToReset);
    } else {
      // إعادة تعيين العداد الافتراضي
      counts[currentCounterToReset] = 0;
      localStorage.setItem(`counter${currentCounterToReset}`, 0);
      if (currentCounterToReset === 3) {
        updateDisplayQuran(currentCounterToReset);
      } else {
        updateDisplay(currentCounterToReset);
      }
    }
    modal.style.display = 'none';
  }
  currentCounterToReset = null;
};

cancelBtn.onclick = function() {
  modal.style.display = 'none';
  currentCounterToReset = null;
};

function showResetConfirmation(counterId) {
  currentCounterToReset = counterId;
  modal.style.display = 'flex';
}

function resetCustomCounter(id) {
  if (customCounters[id]) {
    currentCounterToReset = id;
    modal.style.display = 'flex';
  }
}

function increment(counterId) {
  if (counts[counterId] < GOAL) {
    counts[counterId] = Math.min(GOAL, counts[counterId] + INCREMENT);
    localStorage.setItem(`counter${counterId}`, counts[counterId]);
    updateDisplay(counterId);
    addEffects(counterId, counts[counterId]); // إضافة التأثيرات
  }
}

function decrement(counterId) {
  counts[counterId] = Math.max(0, counts[counterId] - INCREMENT);
  localStorage.setItem(`counter${counterId}`, counts[counterId]);
  updateDisplay(counterId);
}

function incrementQuran(counterId) {
  if (counts[counterId] < QURAN_GOAL) {
    counts[counterId] = Math.min(QURAN_GOAL, counts[counterId] + QURAN_INCREMENT);
    localStorage.setItem(`counter${counterId}`, counts[counterId]);
    updateDisplayQuran(counterId);
  }
}

function updateDisplay(counterId) {
  const counter = document.getElementById(`counter${counterId}`);
  const progress = document.getElementById(`progress${counterId}`);
  counter.textContent = counts[counterId];
  const progressPercentage = (counts[counterId] / GOAL) * 100;
  progress.style.width = `${progressPercentage}%`;
}

function updateDisplayQuran(counterId) {
  const counter = document.getElementById(`counter${counterId}`);
  const progress = document.getElementById(`progress${counterId}`);
  counter.textContent = counts[counterId];
  const progressPercentage = (counts[counterId] / QURAN_GOAL) * 100;
  progress.style.width = `${progressPercentage}%`;
}

// دالة لإضافة تأثيرات متنوعة
function addEffects(counterId, intensity) {
  const counter = document.getElementById(`counter${counterId}`);
  const container = counter.parentElement;
  
  // إضافة تأثير الضغط
  counter.style.transform = 'scale(1.2)';
  setTimeout(() => counter.style.transform = 'scale(1)', 200);
  
  // إضافة تأثير الإشعاع
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  container.appendChild(ripple);
  setTimeout(() => container.removeChild(ripple), 1000);
  
  // إضافة تأثيرات إضافية بناءً على عدد الضغطات
  if (counts[counterId] > GOAL * 0.25) {
    counter.style.animation = 'pulse 0.5s';
  }
  if (counts[counterId] > GOAL * 0.5) {
    container.style.animation = 'rotate 0.5s';
  }
  if (counts[counterId] > GOAL * 0.75) {
    createParticles(container);
  }
}

// دالة لإنشاء جسيمات متطايرة
function createParticles(container) {
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.setProperty('--x', Math.random() * 200 - 100 + 'px');
    particle.style.setProperty('--y', Math.random() * 200 - 100 + 'px');
    container.appendChild(particle);
    setTimeout(() => container.removeChild(particle), 1000);
  }
}

// تعريف هيكل البيانات للعدادات المخصصة
let customCounters = JSON.parse(localStorage.getItem('customCounters')) || {};

function createCustomCounter(name, goal = 1000, increment = 1) {
  const id = 'custom_' + Date.now();
  customCounters[id] = {
    name,
    count: 0,
    goal,
    increment
  };
  saveCustomCounters();
  createCustomCounterElement(id);
  return id;
}

function deleteCustomCounter(id) {
  if (customCounters[id]) {
    delete customCounters[id];
    saveCustomCounters();
    const element = document.getElementById(`counter-container-${id}`);
    if (element) element.remove();
  }
}

function incrementCustom(id) {
  if (customCounters[id]) {
    const counter = customCounters[id];
    if (counter.count < counter.goal) {
      counter.count = Math.min(counter.goal, counter.count + counter.increment);
      saveCustomCounters();
      updateCustomDisplay(id);
      addEffects(`counter-${id}`, counter.count);
    }
  }
}

function decrementCustom(id) {
  if (customCounters[id]) {
    const counter = customCounters[id];
    counter.count = Math.max(0, counter.count - counter.increment);
    saveCustomCounters();
    updateCustomDisplay(id);
  }
}

function updateCustomDisplay(id) {
  if (customCounters[id]) {
    const counter = document.getElementById(`counter-${id}`);
    const progress = document.getElementById(`progress-${id}`);
    const counterData = customCounters[id];
    
    if (counter && progress) {
      counter.textContent = counterData.count;
      const progressPercentage = (counterData.count / counterData.goal) * 100;
      progress.style.width = `${progressPercentage}%`;
    }
  }
}

function saveCustomCounters() {
  localStorage.setItem('customCounters', JSON.stringify(customCounters));
}

function createCustomCounterElement(id) {
  const counter = customCounters[id];
  const container = document.createElement('div');
  container.className = 'counter-container custom-counter';
  container.id = `counter-container-${id}`;
  
  container.innerHTML = `
    <div class="counter-header">
      <h2>${counter.name}</h2>
      <div class="counter-actions">
        <button class="reset-counter" onclick="resetCustomCounter('${id}')" title="إعادة تعيين">
          <i class="fas fa-undo"></i>
        </button>
        <button class="delete-counter" onclick="deleteCustomCounter('${id}')" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    <div class="counter" id="counter-${id}">${counter.count}</div>
    <div class="progress-bar">
      <div class="progress" id="progress-${id}" style="width: ${(counter.count / counter.goal) * 100}%"></div>
    </div>
    <div class="counter-info">
      <div class="settings-group">
        <label>قيمة الزيادة:</label>
        <input type="number" value="${counter.increment}" min="1" 
          onchange="updateIncrement('${id}', this.value)" placeholder="قيمة الزيادة">
      </div>
      <div class="settings-group">
        <label>الهدف:</label>
        <input type="number" value="${counter.goal}" min="1" 
          onchange="updateGoal('${id}', this.value)" placeholder="الهدف">
      </div>
    </div>
    <div class="button-container">
      <button onclick="incrementCustom('${id}')" class="increment-btn">+${counter.increment}</button>
    </div>
  `;
  
  const addButton = document.querySelector('.add-counter-button');
  addButton.parentNode.insertBefore(container, addButton);
}

function updateIncrement(id, value) {
  if (customCounters[id]) {
    customCounters[id].increment = parseInt(value) || 1;
    saveCustomCounters();
  }
}

function updateGoal(id, value) {
  if (customCounters[id]) {
    customCounters[id].goal = parseInt(value) || 1000;
    saveCustomCounters();
    updateCustomDisplay(id);
  }
}

// تحديث العرض عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  updateDisplay(1);
  updateDisplay(2);
  updateDisplayQuran(3);

  const savedTheme = localStorage.getItem("theme");
  const savedColorTheme = localStorage.getItem("color-theme");

  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  }

  if (savedColorTheme) {
    document.body.className = `theme-${savedColorTheme}`;
  }

  updateStopwatchDisplay('work');
  updateStopwatchDisplay('worship');

  // إنشاء قسم مخصص للعدادات المخصصة
  const customCountersSection = document.createElement('div');
  customCountersSection.className = 'custom-counters-section';
  document.querySelector('.container').appendChild(customCountersSection);
  
  // إضافة زر إنشاء عداد جديد
  const addCounterButton = document.createElement('button');
  addCounterButton.className = 'add-counter-button';
  addCounterButton.innerHTML = '<i class="fas fa-plus"></i> إضافة عداد جديد';
  addCounterButton.onclick = function() {
    const name = prompt('أدخل اسم العداد الجديد');
    if (name) {
      const goal = parseInt(prompt('أدخل الهدف', '1000')) || 1000;
      const increment = parseInt(prompt('أدخل قيمة الزيادة', '1')) || 1;
      createCustomCounter(name, goal, increment);
    }
  };
  customCountersSection.appendChild(addCounterButton);
  
  // تحميل العدادات المخصصة المحفوظة
  Object.keys(customCounters).forEach(id => {
    createCustomCounterElement(id);
  });
});

// القائمة الجانبية
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

function toggleTheme() {
  const body = document.body;
  if (body.hasAttribute("data-theme")) {
    body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem("color-theme", theme);
}

// Stopwatch functionality
const EIGHT_HOURS_IN_SECONDS = 8 * 60 * 60;
const stopwatches = {
  work: {
    seconds: parseInt(localStorage.getItem('work-seconds') || '0'),
    isRunning: false,
    interval: null
  },
  worship: {
    seconds: parseInt(localStorage.getItem('worship-seconds') || '0'),
    isRunning: false,
    interval: null
  }
};

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  };
}

function updateStopwatchDisplay(type) {
  const time = formatTime(stopwatches[type].seconds);
  document.getElementById(`${type}-hours`).textContent = time.hours;
  document.getElementById(`${type}-minutes`).textContent = time.minutes;
  document.getElementById(`${type}-seconds`).textContent = time.seconds;
  
  // Update progress bar
  const progress = (stopwatches[type].seconds / EIGHT_HOURS_IN_SECONDS) * 100;
  document.getElementById(`${type}-progress`).style.width = `${Math.min(100, progress)}%`;
  
  // Save to localStorage
  localStorage.setItem(`${type}-seconds`, stopwatches[type].seconds.toString());
}

function toggleStopwatch(type) {
  const stopwatch = stopwatches[type];
  const button = document.querySelector(`#${type}-stopwatch .start-btn`);
  const icon = button.querySelector('i');

  if (stopwatch.isRunning) {
    // Stop the stopwatch
    clearInterval(stopwatch.interval);
    stopwatch.isRunning = false;
    button.classList.remove('active');
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  } else {
    // Start the stopwatch
    stopwatch.interval = setInterval(() => {
      if (stopwatch.seconds < EIGHT_HOURS_IN_SECONDS) {
        stopwatch.seconds++;
        updateStopwatchDisplay(type);
      } else {
        clearInterval(stopwatch.interval);
        stopwatch.isRunning = false;
        button.classList.remove('active');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      }
    }, 1000);
    stopwatch.isRunning = true;
    button.classList.add('active');
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
  }
}

function resetStopwatch(type) {
  const stopwatch = stopwatches[type];
  clearInterval(stopwatch.interval);
  stopwatch.seconds = 0;
  stopwatch.isRunning = false;
  
  const button = document.querySelector(`#${type}-stopwatch .start-btn`);
  const icon = button.querySelector('i');
  button.classList.remove('active');
  icon.classList.remove('fa-pause');
  icon.classList.add('fa-play');
  
  updateStopwatchDisplay(type);
}

// Stopwatch Reset Modal
let stopwatchToReset = null;
const stopwatchResetModal = document.getElementById('stopwatchResetModal');
const confirmStopwatchReset = document.getElementById('confirmStopwatchReset');
const cancelStopwatchReset = document.getElementById('cancelStopwatchReset');

function showStopwatchResetConfirmation(type) {
  stopwatchToReset = type;
  stopwatchResetModal.style.display = 'flex';
}

confirmStopwatchReset.onclick = function() {
  if (stopwatchToReset) {
    resetStopwatch(stopwatchToReset);
    stopwatchResetModal.style.display = 'none';
    stopwatchToReset = null;
  }
};

cancelStopwatchReset.onclick = function() {
  stopwatchResetModal.style.display = 'none';
  stopwatchToReset = null;
};

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target === stopwatchResetModal) {
    stopwatchResetModal.style.display = 'none';
    stopwatchToReset = null;
  }
};
