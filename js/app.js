// 移动端导航栏激活状态
document.addEventListener('DOMContentLoaded', function() {
  // 获取当前页面路径
  const currentPath = window.location.pathname;
  
  // 设置移动端导航栏激活状态
  const mobileNavLinks = document.querySelectorAll('.mobile-navbar-link');
  mobileNavLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (link.getAttribute('href') !== '/' && currentPath.startsWith(link.getAttribute('href')))) {
      link.classList.add('active');
    }
  });
  
  // 设置桌面端导航栏激活状态
  const navLinks = document.querySelectorAll('.navbar-link');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (link.getAttribute('href') !== '/' && currentPath.startsWith(link.getAttribute('href')))) {
      link.classList.add('active');
    }
  });
  
  // 处理题目选择
  const questionOptions = document.querySelectorAll('.question-option');
  questionOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 在单选题中，取消其他选项的选中状态
      if (this.closest('.question-card').dataset.type === 'single_choice') {
        const siblingOptions = this.closest('.question-options').querySelectorAll('.question-option');
        siblingOptions.forEach(siblingOption => {
          siblingOption.classList.remove('selected');
        });
      }
      
      // 切换当前选项的选中状态
      this.classList.toggle('selected');
    });
  });
  
  // 答案标签页切换
  const answerTabs = document.querySelectorAll('.answer-tab');
  answerTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // 获取所有标签页和内容
      const tabs = this.closest('.answer-tabs').querySelectorAll('.answer-tab');
      const contents = document.querySelectorAll('.answer-content');
      
      // 移除所有激活状态
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');
      
      // 设置当前标签页和内容的激活状态
      this.classList.add('active');
      const contentId = this.dataset.tab;
      document.getElementById(contentId).style.display = 'block';
    });
  });
  
  // 时间倒计时功能
  const timerElement = document.getElementById('exam-timer');
  if (timerElement) {
    let timeLeft = parseInt(timerElement.dataset.timeLeft);
    
    const timerInterval = setInterval(function() {
      timeLeft--;
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert('考试时间已结束，系统将自动提交您的答案！');
        document.getElementById('submit-exam-form').submit();
      }
      
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      
      timerElement.textContent = 
        String(hours).padStart(2, '0') + ':' + 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
    }, 1000);
  }
  
  // 初始化答案标签页
  const initialTab = document.querySelector('.answer-tab.active');
  if (initialTab) {
    const contentId = initialTab.dataset.tab;
    document.getElementById(contentId).style.display = 'block';
  }
  
  // 管理端侧边栏激活状态
  const adminNavLinks = document.querySelectorAll('.admin-nav-link');
  adminNavLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (link.getAttribute('href') !== '/admin' && currentPath.startsWith(link.getAttribute('href')))) {
      link.classList.add('active');
    }
  });
}); 