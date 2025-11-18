// 逆行人生 - 时间倒计时组件
(function() {
  'use strict';

  function initLifeTime() {
    // 如果组件不存在，直接返回
    if (!document.querySelector('.life-time-card')) {
      return;
    }

    function getLifeTime() {
      // 当前时间戳
      const nowDate = +new Date();
      
      // 今天开始时间戳（当天的00:00:00）
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStartDate = today.getTime();
      
      // 今天已经过去的时间（小时）
      const todayPassHours = (nowDate - todayStartDate) / 1000 / 60 / 60;
      // 今天已经过去的时间百分比
      const todayPassHoursPercent = (todayPassHours / 24) * 100;
      
      const dayProgressEl = document.getElementById('dayProgress');
      if (dayProgressEl) {
        const span = dayProgressEl.querySelector('.title span');
        const progressInner = dayProgressEl.querySelector('.progress-inner');
        const progressPercentage = dayProgressEl.querySelector('.progress-percentage');
        if (span) span.textContent = Math.floor(todayPassHours);
        if (progressInner) progressInner.style.width = Math.floor(todayPassHoursPercent) + '%';
        if (progressPercentage) progressPercentage.textContent = Math.floor(todayPassHoursPercent) + '%';
      }
      
      // 当前周几（0=周日，1=周一...6=周六）
      const weeks = {
        0: 7,  // 周日算作第7天
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6
      };
      const weekDay = weeks[new Date().getDay()];
      const weekDayPassPercent = (weekDay / 7) * 100;
      
      const weekProgressEl = document.getElementById('weekProgress');
      if (weekProgressEl) {
        const span = weekProgressEl.querySelector('.title span');
        const progressInner = weekProgressEl.querySelector('.progress-inner');
        const progressPercentage = weekProgressEl.querySelector('.progress-percentage');
        if (span) span.textContent = weekDay;
        if (progressInner) progressInner.style.width = Math.floor(weekDayPassPercent) + '%';
        if (progressPercentage) progressPercentage.textContent = Math.floor(weekDayPassPercent) + '%';
      }
      
      // 本月已过去的天数
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1; // 当前月份（1-12）
      const date = new Date().getDate(); // 当前日期
      // 获取当前月份的总天数
      const monthAll = new Date(year, month, 0).getDate();
      const monthPassPercent = (date / monthAll) * 100;
      
      const monthProgressEl = document.getElementById('monthProgress');
      if (monthProgressEl) {
        const span = monthProgressEl.querySelector('.title span');
        const progressInner = monthProgressEl.querySelector('.progress-inner');
        const progressPercentage = monthProgressEl.querySelector('.progress-percentage');
        if (span) span.textContent = date;
        if (progressInner) progressInner.style.width = Math.floor(monthPassPercent) + '%';
        if (progressPercentage) progressPercentage.textContent = Math.floor(monthPassPercent) + '%';
      }
      
      // 今年已经过去的时间（月份）
      const yearPass = (month / 12) * 100;
      
      const yearProgressEl = document.getElementById('yearProgress');
      if (yearProgressEl) {
        const span = yearProgressEl.querySelector('.title span');
        const progressInner = yearProgressEl.querySelector('.progress-inner');
        const progressPercentage = yearProgressEl.querySelector('.progress-percentage');
        if (span) span.textContent = month;
        if (progressInner) progressInner.style.width = Math.floor(yearPass) + '%';
        if (progressPercentage) progressPercentage.textContent = Math.floor(yearPass) + '%';
      }
    }

    // 立即执行一次
    getLifeTime();
    
    // 每秒更新一次
    setInterval(() => {
      getLifeTime();
    }, 1000);
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLifeTime);
  } else {
    initLifeTime();
  }

  // 支持PJAX重新初始化
  document.addEventListener('pjax:complete', function() {
    setTimeout(initLifeTime, 100);
  });
})();

