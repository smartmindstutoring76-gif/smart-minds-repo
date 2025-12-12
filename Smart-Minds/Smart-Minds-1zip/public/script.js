function toggleMobileMenu() {
  var mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.toggle('open');
}

function toggleFaq(element) {
  var faqItem = element.parentElement;
  var allFaqItems = document.querySelectorAll('.faq-item');
  
  allFaqItems.forEach(function(item) {
    if (item !== faqItem) {
      item.classList.remove('open');
    }
  });
  
  faqItem.classList.toggle('open');
}

function toggleSubjectChapters(subjectId) {
  var card = document.getElementById(subjectId);
  if (card) {
    card.classList.toggle('open');
  }
}

document.addEventListener('click', function(event) {
  var mobileNav = document.getElementById('mobileNav');
  var menuBtn = document.querySelector('.mobile-menu-btn');
  
  if (mobileNav && mobileNav.classList.contains('open')) {
    if (!mobileNav.contains(event.target) && !menuBtn.contains(event.target)) {
      mobileNav.classList.remove('open');
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var header = document.querySelector('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
  
  updateLiveLessonCard();
  setInterval(updateLiveLessonCard, 1000);
});

var schedule = {
  0: [],
  1: [
    { time: '18:00 - 20:00', subjects: 'Maths & Business Studies' },
    { time: '20:00 - 22:00', subjects: 'Accounting & Life Sciences' }
  ],
  2: [
    { time: '18:00 - 20:00', subjects: 'Accounting & Geography' },
    { time: '20:00 - 22:00', subjects: 'Math Literacy & Physical Sciences' },
    { time: '22:00 - 23:00', subjects: 'Economics' }
  ],
  3: [
    { time: '18:00 - 20:00', subjects: 'Economics & Physical Sciences' },
    { time: '20:00 - 22:00', subjects: 'Geography & Mathematics' }
  ],
  4: [
    { time: '18:00 - 20:00', subjects: 'Life Sciences & Business Studies' },
    { time: '20:00 - 22:00', subjects: 'Math Literacy & Accounting' }
  ],
  5: [
    { time: '18:00 - 20:00', subjects: 'Physical Sciences & Mathematics' },
    { time: '20:00 - 22:00', subjects: 'Economics & Geography' }
  ],
  6: [
    { time: '09:00 - 12:00', subjects: 'Revision Sessions' },
    { time: '14:00 - 17:00', subjects: 'Exam Prep' }
  ]
};

var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function updateLiveLessonCard() {
  var heroCard = document.querySelector('.hero-card');
  if (!heroCard) return;
  
  var now = new Date();
  var currentDay = now.getDay();
  var currentHour = now.getHours();
  var currentMinute = now.getMinutes();
  var currentSecond = now.getSeconds();
  
  var timeString = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  var dateString = now.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  var dayString = dayNames[currentDay];
  
  var dateTimeElement = document.getElementById('currentDateTime');
  if (dateTimeElement) {
    dateTimeElement.innerHTML = '<span class="live-time">' + timeString + '</span><span class="live-date">' + dayString + ', ' + dateString + '</span>';
  }
  
  var nextLesson = findNextLesson(currentDay, currentHour, currentMinute);
  var titleElement = document.getElementById('nextLessonTitle');
  
  if (titleElement) {
    if (nextLesson) {
      titleElement.textContent = 'Next: ' + nextLesson.subjects.split(' & ')[0];
    } else {
      titleElement.textContent = 'Check Schedule';
    }
  }
  
  var upcomingLessons = getUpcomingLessons(currentDay, currentHour, currentMinute);
  
  var lesson1 = document.getElementById('lesson1');
  var lesson2 = document.getElementById('lesson2');
  
  if (lesson1 && upcomingLessons[0]) {
    var l = upcomingLessons[0];
    lesson1.querySelector('.lesson-icon').textContent = l.subjects.charAt(0);
    lesson1.querySelector('h4').textContent = l.subjects;
    lesson1.querySelector('p').textContent = l.day + ', ' + l.time;
  }
  
  if (lesson2 && upcomingLessons[1]) {
    var l2 = upcomingLessons[1];
    lesson2.querySelector('.lesson-icon').textContent = l2.subjects.charAt(0);
    lesson2.querySelector('h4').textContent = l2.subjects;
    lesson2.querySelector('p').textContent = l2.day + ', ' + l2.time;
  }
}

function findNextLesson(currentDay, currentHour, currentMinute) {
  var currentTime = currentHour * 60 + currentMinute;
  
  var todayLessons = schedule[currentDay] || [];
  for (var i = 0; i < todayLessons.length; i++) {
    var lessonStartHour = parseInt(todayLessons[i].time.split(':')[0]);
    var lessonStartTime = lessonStartHour * 60;
    if (currentTime < lessonStartTime) {
      return todayLessons[i];
    }
  }
  
  for (var d = 1; d <= 7; d++) {
    var nextDay = (currentDay + d) % 7;
    var nextDayLessons = schedule[nextDay] || [];
    if (nextDayLessons.length > 0) {
      return nextDayLessons[0];
    }
  }
  
  return null;
}

function getUpcomingLessons(currentDay, currentHour, currentMinute) {
  var upcoming = [];
  var currentTime = currentHour * 60 + currentMinute;
  
  var todayLessons = schedule[currentDay] || [];
  for (var i = 0; i < todayLessons.length; i++) {
    var lessonStartHour = parseInt(todayLessons[i].time.split(':')[0]);
    var lessonStartTime = lessonStartHour * 60;
    if (currentTime < lessonStartTime) {
      upcoming.push({
        day: dayNames[currentDay],
        time: todayLessons[i].time,
        subjects: todayLessons[i].subjects
      });
    }
  }
  
  for (var d = 1; d <= 7 && upcoming.length < 2; d++) {
    var nextDay = (currentDay + d) % 7;
    var nextDayLessons = schedule[nextDay] || [];
    for (var j = 0; j < nextDayLessons.length && upcoming.length < 2; j++) {
      upcoming.push({
        day: dayNames[nextDay],
        time: nextDayLessons[j].time,
        subjects: nextDayLessons[j].subjects
      });
    }
  }
  
  return upcoming;
}

var TUTOR_PASSWORD = 'Dinner4tutors!';
var PAID_USERS = [
  'learner@example.com',
  'student@test.com'
];

function handleLogin(event) {
  event.preventDefault();
  
  var emailPhone = document.getElementById('emailPhone').value.trim();
  var password = document.getElementById('password').value;
  var rememberMe = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
  
  if (!emailPhone || !password) {
    showLoginError('Please enter both email/phone and password.');
    return;
  }
  
  if (password === TUTOR_PASSWORD) {
    if (rememberMe) {
      localStorage.setItem('rememberedUser', emailPhone);
    } else {
      localStorage.removeItem('rememberedUser');
    }
    
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userEmail', emailPhone);
    sessionStorage.setItem('userType', 'tutor');
    
    window.location.href = 'dashboard.html';
    return;
  }
  
  var isPaidUser = checkPaidUser(emailPhone);
  
  if (isPaidUser) {
    if (rememberMe) {
      localStorage.setItem('rememberedUser', emailPhone);
    } else {
      localStorage.removeItem('rememberedUser');
    }
    
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userEmail', emailPhone);
    sessionStorage.setItem('userType', 'learner');
    
    window.location.href = 'dashboard.html';
  } else {
    showLoginError('Access denied. Only paid subscribers can log in. Please contact us on WhatsApp (+27 81 699 1450) to complete your payment and get access.');
  }
}

function checkPaidUser(email) {
  var paidUsers = JSON.parse(localStorage.getItem('paidUsers') || '[]');
  return paidUsers.includes(email.toLowerCase()) || PAID_USERS.includes(email.toLowerCase());
}

function addPaidUser(email) {
  var paidUsers = JSON.parse(localStorage.getItem('paidUsers') || '[]');
  if (!paidUsers.includes(email.toLowerCase())) {
    paidUsers.push(email.toLowerCase());
    localStorage.setItem('paidUsers', JSON.stringify(paidUsers));
  }
}

function showLoginError(message) {
  var existingError = document.querySelector('.login-error');
  if (existingError) {
    existingError.remove();
  }
  
  var errorDiv = document.createElement('div');
  errorDiv.className = 'login-error';
  errorDiv.innerHTML = '<p>' + message + '</p>';
  
  var form = document.getElementById('loginForm');
  if (form) {
    form.insertBefore(errorDiv, form.firstChild);
  }
}

function handleLogout() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userType');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
  var emailPhoneInput = document.getElementById('emailPhone');
  if (emailPhoneInput) {
    var rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      emailPhoneInput.value = rememberedUser;
      var rememberMeCheckbox = document.getElementById('rememberMe');
      if (rememberMeCheckbox) {
        rememberMeCheckbox.checked = true;
      }
    }
  }
  
  var greeting = document.getElementById('dashboardGreeting');
  var userEmail = sessionStorage.getItem('userEmail');
  var userType = sessionStorage.getItem('userType');
  
  if (greeting && userEmail) {
    var name = userEmail.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (userType === 'tutor') {
      greeting.textContent = 'Welcome, Tutor ' + name + '! Ready to teach today?';
    } else {
      greeting.textContent = 'Hello ' + name + '! Ready to learn something new today?';
    }
  }
});
