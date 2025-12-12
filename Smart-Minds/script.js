function scrollToTop(event) {
  if (event) {
    var href = event.target.getAttribute('href');
    if (href && href.includes('.html')) {
      return true;
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
  
  var headerLabel = heroCard.querySelector('.hero-card-label');
  var headerTitle = heroCard.querySelector('.hero-card-title');
  
  if (headerLabel) {
    headerLabel.innerHTML = '<span style="display: block; font-size: 1.1rem; color: white; font-weight: 600;">' + timeString + '</span>' +
                           '<span style="display: block; margin-top: 2px;">' + dayString + ', ' + dateString + '</span>';
  }
  
  var nextLesson = findNextLesson(currentDay, currentHour, currentMinute);
  
  if (headerTitle) {
    if (nextLesson) {
      headerTitle.textContent = 'Next: ' + nextLesson.subjects.split(' & ')[0];
    } else {
      headerTitle.textContent = 'Check Schedule';
    }
  }
  
  var lessonItems = heroCard.querySelectorAll('.lesson-item');
  var upcomingLessons = getUpcomingLessons(currentDay, currentHour, currentMinute);
  
  lessonItems.forEach(function(item, index) {
    if (upcomingLessons[index]) {
      var lesson = upcomingLessons[index];
      var icon = item.querySelector('.lesson-icon');
      var info = item.querySelector('.lesson-info');
      
      if (icon) {
        icon.textContent = lesson.subjects.charAt(0);
      }
      if (info) {
        var h4 = info.querySelector('h4');
        var p = info.querySelector('p');
        if (h4) h4.textContent = lesson.subjects;
        if (p) p.textContent = lesson.day + ', ' + lesson.time;
      }
    }
  });
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

function handleLogin(event) {
  event.preventDefault();
  
  var emailPhone = document.getElementById('emailPhone').value;
  var password = document.getElementById('password').value;
  var rememberMe = document.getElementById('rememberMe').checked;
  
  if (emailPhone && password) {
    if (rememberMe) {
      localStorage.setItem('rememberedUser', emailPhone);
    } else {
      localStorage.removeItem('rememberedUser');
    }
    
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userEmail', emailPhone);
    
    window.location.href = 'dashboard.html';
  } else {
    alert('Please enter both email/phone and password.');
  }
}

function handleLogout() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('userEmail');
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
});

var quizData = {
  'life-sciences': {
    name: 'Life Sciences',
    questions: [
      {
        question: 'What is the process by which cells divide to produce gametes with half the number of chromosomes?',
        options: ['Mitosis', 'Meiosis', 'Binary fission', 'Budding'],
        correct: 1
      },
      {
        question: 'Which part of the brain is responsible for coordinating voluntary muscle movements?',
        options: ['Medulla oblongata', 'Hypothalamus', 'Cerebellum', 'Cerebrum'],
        correct: 2
      },
      {
        question: 'What is the function of the hormone insulin?',
        options: ['Increases blood glucose levels', 'Decreases blood glucose levels', 'Stimulates growth', 'Regulates calcium levels'],
        correct: 1
      },
      {
        question: 'Which blood vessel carries oxygenated blood from the lungs to the heart?',
        options: ['Pulmonary artery', 'Pulmonary vein', 'Aorta', 'Vena cava'],
        correct: 1
      },
      {
        question: 'What is the correct sequence of DNA replication?',
        options: ['Helicase unwinds DNA, DNA polymerase adds nucleotides, Ligase joins fragments', 'DNA polymerase adds nucleotides, Helicase unwinds DNA, Ligase joins fragments', 'Ligase joins fragments, Helicase unwinds DNA, DNA polymerase adds nucleotides', 'None of the above'],
        correct: 0
      }
    ]
  },
  'economics': {
    name: 'Economics',
    questions: [
      {
        question: 'What does GDP stand for?',
        options: ['General Domestic Production', 'Gross Domestic Product', 'General Development Plan', 'Gross Development Production'],
        correct: 1
      },
      {
        question: 'Which market structure has many sellers with differentiated products?',
        options: ['Perfect competition', 'Monopoly', 'Monopolistic competition', 'Oligopoly'],
        correct: 2
      },
      {
        question: 'What is the main objective of fiscal policy?',
        options: ['Control money supply', 'Manage government spending and taxation', 'Set interest rates', 'Control inflation only'],
        correct: 1
      },
      {
        question: 'What happens to the exchange rate when demand for a currency increases?',
        options: ['It depreciates', 'It appreciates', 'It stays the same', 'It becomes fixed'],
        correct: 1
      },
      {
        question: 'Which of the following is NOT a factor of production?',
        options: ['Land', 'Labour', 'Money', 'Entrepreneurship'],
        correct: 2
      }
    ]
  },
  'geography': {
    name: 'Geography',
    questions: [
      {
        question: 'What type of weather system is associated with rising air and low pressure?',
        options: ['Anticyclone', 'Cyclone', 'Ridge', 'Cold front'],
        correct: 1
      },
      {
        question: 'What is the primary cause of tropical cyclones?',
        options: ['Cold ocean water', 'Warm ocean water above 26C', 'Continental drift', 'Mountain ranges'],
        correct: 1
      },
      {
        question: 'Which type of erosion is caused by rivers?',
        options: ['Aeolian erosion', 'Fluvial erosion', 'Glacial erosion', 'Marine erosion'],
        correct: 1
      },
      {
        question: 'What does GIS stand for?',
        options: ['Geographic Information System', 'Global Internet Service', 'General Information Source', 'Geographic Internet System'],
        correct: 0
      },
      {
        question: 'What is a drainage basin?',
        options: ['A type of lake', 'An area drained by a river and its tributaries', 'A water storage facility', 'A type of dam'],
        correct: 1
      }
    ]
  },
  'business-studies': {
    name: 'Business Studies',
    questions: [
      {
        question: 'What does BBBEE stand for?',
        options: ['Basic Black Economic Empowerment', 'Broad-Based Black Economic Empowerment', 'Business Black Economic Empowerment', 'Basic Business Economic Empowerment'],
        correct: 1
      },
      {
        question: 'Which management function involves setting goals and determining actions?',
        options: ['Organizing', 'Leading', 'Planning', 'Controlling'],
        correct: 2
      },
      {
        question: 'What is the primary purpose of a SWOT analysis?',
        options: ['Calculate profits', 'Analyze strengths, weaknesses, opportunities and threats', 'Hire employees', 'Create budgets'],
        correct: 1
      },
      {
        question: 'Which legislation protects consumers from unfair business practices?',
        options: ['Labour Relations Act', 'Consumer Protection Act', 'Companies Act', 'BBBEE Act'],
        correct: 1
      },
      {
        question: 'What is quality control?',
        options: ['Checking products at the end of production', 'Training employees', 'Marketing products', 'Setting prices'],
        correct: 0
      }
    ]
  },
  'accounting': {
    name: 'Accounting',
    questions: [
      {
        question: 'What is the accounting equation?',
        options: ['Assets = Liabilities + Equity', 'Assets = Liabilities - Equity', 'Assets + Liabilities = Equity', 'Equity = Assets + Liabilities'],
        correct: 0
      },
      {
        question: 'Which financial statement shows the profit or loss of a business?',
        options: ['Balance Sheet', 'Income Statement', 'Cash Flow Statement', 'Statement of Changes in Equity'],
        correct: 1
      },
      {
        question: 'What is depreciation?',
        options: ['Increase in asset value', 'Decrease in asset value over time', 'Sale of an asset', 'Purchase of an asset'],
        correct: 1
      },
      {
        question: 'What type of account is "Sales"?',
        options: ['Asset', 'Liability', 'Income', 'Expense'],
        correct: 2
      },
      {
        question: 'What does the term "liquidity" refer to?',
        options: ['Ability to pay long-term debts', 'Ability to convert assets to cash quickly', 'Total value of assets', 'Profit margin'],
        correct: 1
      }
    ]
  }
};

var currentQuiz = null;
var currentQuestionIndex = 0;
var score = 0;
var answeredQuestions = [];

function startQuiz(subjectId) {
  currentQuiz = quizData[subjectId];
  currentQuestionIndex = 0;
  score = 0;
  answeredQuestions = [];
  
  document.getElementById('quiz-selection').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  document.getElementById('quiz-results').style.display = 'none';
  
  document.getElementById('quiz-subject-title').textContent = currentQuiz.name + ' Quiz';
  
  showQuestion();
}

function showQuestion() {
  var question = currentQuiz.questions[currentQuestionIndex];
  
  document.getElementById('question-number').textContent = 'Question ' + (currentQuestionIndex + 1) + ' of ' + currentQuiz.questions.length;
  document.getElementById('question-text').textContent = question.question;
  
  var optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  question.options.forEach(function(option, index) {
    var button = document.createElement('button');
    button.className = 'quiz-option';
    button.textContent = option;
    button.onclick = function() { selectAnswer(index); };
    optionsContainer.appendChild(button);
  });
  
  document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(selectedIndex) {
  var question = currentQuiz.questions[currentQuestionIndex];
  var options = document.querySelectorAll('.quiz-option');
  
  options.forEach(function(opt, i) {
    opt.disabled = true;
    if (i === question.correct) {
      opt.classList.add('correct');
    } else if (i === selectedIndex && selectedIndex !== question.correct) {
      opt.classList.add('incorrect');
    }
  });
  
  if (selectedIndex === question.correct) {
    score++;
  }
  
  answeredQuestions.push({
    question: question.question,
    selected: selectedIndex,
    correct: question.correct,
    options: question.options
  });
  
  document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex < currentQuiz.questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('quiz-results').style.display = 'block';
  
  var percentage = Math.round((score / currentQuiz.questions.length) * 100);
  
  document.getElementById('final-score').textContent = score + ' / ' + currentQuiz.questions.length;
  document.getElementById('score-percentage').textContent = percentage + '%';
  
  var message = '';
  if (percentage >= 80) {
    message = 'Excellent! You really know your stuff!';
  } else if (percentage >= 60) {
    message = 'Good job! Keep practicing to improve!';
  } else if (percentage >= 40) {
    message = 'Not bad! Review the material and try again.';
  } else {
    message = 'Keep studying! You can do better next time.';
  }
  document.getElementById('result-message').textContent = message;
}

function restartQuiz() {
  startQuiz(Object.keys(quizData).find(function(key) { return quizData[key] === currentQuiz; }));
}

function backToQuizzes() {
  document.getElementById('quiz-selection').style.display = 'block';
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('quiz-results').style.display = 'none';
  currentQuiz = null;
}
