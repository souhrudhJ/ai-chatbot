document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.querySelector(".progress-bar");
  
    let progress = 0;
  
    function updateProgress(target, duration, pause, callback) {
      const start = progress;
      const startTime = performance.now();
  
      function animate(time) {
        const elapsed = time - startTime;
        const fraction = Math.min(elapsed / duration, 1);
        progress = start + (target - start) * fraction;
  
        progressBar.style.width = `${progress}%`;
  
        if (fraction < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(callback, pause); 
        }
      }
  
      requestAnimationFrame(animate);
    }
  
    // Animation sequence
    updateProgress(30, 2000, 1000, () => {
      updateProgress(75, 2000, 500, () => { 
        updateProgress(100, 2000, 0, () => { 
          setTimeout(() => {
            window.location.href = "samanthaChat.html"; 
          }, 500);
        });
      });
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const loadingText = document.getElementById("loading-text");
  
    const messages = [
      "Loading...",
      "Connecting to Samantha...",
      "Connecting to Samantha...",
      "Almost there..."
    ];
  
    let index = 0;
    const interval = setInterval(() => {
      loadingText.textContent = messages[index];
      index++;
      if (index >= messages.length) {
        clearInterval(interval);
      }
    }, 1250); 
  });
   