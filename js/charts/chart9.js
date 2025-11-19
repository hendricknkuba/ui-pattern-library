// -------------------------------
// Chart 9 JS File
// -------------------------------

console.log("chart9.js loaded");

// Observer to trigger animation only when element enters viewport
const chart9_observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Run animation once
      const target = entry.target;
      const finalValue = parseInt(target.getAttribute("data-value"));
      animateCountUp(target, finalValue);

      // Stop observing so it doesn't repeat
      chart9_observer.unobserve(target);
    }
  });
}, { threshold: 0.5 }); // triggers when 50% of the card is visible


function chart9_channelMostSubscribers(youtubeData) {

  // Find the channel with the most subscribers
  const maxChannel = youtubeData.reduce((max, current) => {
    return current.subscribers > max.subscribers ? current : max;
  });

  // Get the chart area
  const chart9Area = document.querySelector("#chart9 .chart-area");

  if (!chart9Area) {
    console.error("Chart 9 area not found");
    return;
  }

  // Clear any existing content
  chart9Area.innerHTML = "";

 // Render single-value metric card
  chart9Area.innerHTML = `
    <div style="
      background: white;
      padding: 26px;
      border-radius: 14px;
      text-align: center;
      border: 1px solid #eee;
      box-shadow: 0px 2px 10px rgba(0,0,0,0.08);
      max-width: 330px;
      margin: 0 auto;
    ">
      
      <!-- Title -->
      <p style="
        font-family: serif;
        font-size: 20px;
        color: #111;
        margin-bottom: 10px;
      ">
        Most Subscribed Channel
      </p>

      <!-- Big number -->
      <p style="
        font-size: 42px;
        font-weight: bold;
        color: #D72638;
        margin: 0;
        line-height: 1.1;
      ">
        0
      </p>

      <!-- Label below -->
      <p style="
        font-size: 18px;
        color: #333;
        margin-top: 6px;
      ">
        ${maxChannel.channel_title}
      </p>

    </div>
  `;

  // Get the number element
  const numberElement = document.querySelector("#chart9 .chart-area p:nth-of-type(2)");

  // Store final value in attribute
  numberElement.setAttribute("data-value", maxChannel.subscribers);

  // Start observing for scroll-into-view animation
  chart9_observer.observe(numberElement);
}

// Smooth count-up animation for single value metrics
function animateCountUp(element, endValue, duration = 1200) {
  let startTime = null;
  const startValue = 0;

  function update(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    // Ease-out animation
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(startValue + easedProgress * endValue);

    element.textContent = formatLarge(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}