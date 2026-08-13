document.addEventListener('DOMContentLoaded', () => {
  // 1. Inspect Response Headers
  const inspectBtn = document.getElementById('inspect-btn');
  const headersOutput = document.getElementById('headers-output');
  const headersContent = document.getElementById('headers-content');

  inspectBtn.addEventListener('click', async () => {
    try {
      // HEAD request to inspect raw headers served by Nginx
      const response = await fetch(window.location.href, { method: 'HEAD' });
      let headersText = `Status: ${response.status} ${response.statusText}\n\n`;
      
      for (let [key, value] of response.headers.entries()) {
        headersText += `${key}: ${value}\n`;
      }

      headersContent.textContent = headersText;
      headersOutput.classList.remove('hidden');
    } catch (err) {
      headersContent.textContent = 'Error fetching headers: ' + err.message;
      headersOutput.classList.remove('hidden');
    }
  });

  // 2. Traffic Load Simulator
  const simulateBtn = document.getElementById('simulate-btn');
  const reqCountInput = document.getElementById('req-count');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const simStatus = document.getElementById('sim-status');

  simulateBtn.addEventListener('click', async () => {
    const totalRequests = parseInt(reqCountInput.value, 10) || 10;
    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    simStatus.textContent = 'Firing requests...';

    let completed = 0;
    let failed = 0;

    const fetchPromises = Array.from({ length: totalRequests }, async () => {
      try {
        const res = await fetch(window.location.href + '?req=' + Math.random());
        if (!res.ok) failed++;
      } catch {
        failed++;
      } finally {
        completed++;
        const percent = Math.floor((completed / totalRequests) * 100);
        progressBar.style.width = `${percent}%`;
      }
    });

    await Promise.all(fetchPromises);
    simStatus.textContent = `Done! Sent: ${totalRequests} | Success: ${totalRequests - failed} | Failed/Limited: ${failed}`;
  });

  // 3. Timestamp / Cache Check
  const timeBtn = document.getElementById('time-btn');
  const timestampDisplay = document.getElementById('timestamp-display');

  timeBtn.addEventListener('click', () => {
    const now = new Date();
    timestampDisplay.textContent = `${now.toLocaleTimeString()} . ${now.getMilliseconds()}ms`;
  });
});
