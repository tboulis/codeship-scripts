/**
 * If you can't get access to the codeship API use this script in your browser console (not recommended though).
 * Simply visit https://app.codeship.com/projects/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX and paste all this code in the console
 * It will print in the console the average Hours per month and Minutes per month for the current project's builds.
 */
async function getBuildDurationsTotal(monthsBack) {
  const sleep = (ms) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, ms)
    );
  const timeToSeconds = (time) => {
    var b = time.split(':');
    return b[0]*60 + +b[1];
  }
  const currentMonth = new Date().getMonth();
  const dateXMonthsAgo = new Date();
  dateXMonthsAgo.setMonth(currentMonth - monthsBack)
  const loadMoreButton = document.querySelector(
    "button.build-pagination.btn.btn-secondary.btn-full"
  );
  
  let oldestBuildDate = new Date();
  do {
    loadMoreButton?.click();
    await sleep(4000);
    const oldestBuild = document.querySelector(
      `ul.build-list > span > div:last-child div.tooltip-action.build-details-secondary.build-details-time > time`
    );
    oldestBuildDate = new Date(oldestBuild.dateTime);
  } while (dateXMonthsAgo.getTime() < oldestBuildDate.getTime());

  const durations = document.querySelectorAll(
    ".build-details-time-elapsed > time.build-details-secondary"
  )
  const count = durations.length;
  let totalSeconds = 0;
  durations.forEach(duration => {
    const val = duration.innerText.trim();
    totalSeconds += timeToSeconds(val);
  })
  const hoursPerMonth = totalSeconds/monthsBack/30/30
  const minutesPerMonth = totalSeconds / monthsBack / 30;
  console.log("Minutes per month: ", minutesPerMonth);
  console.log("Hours per month: ", hoursPerMonth);
}

// pass in months to go back as int. After 3-4 months the UI gets too slow
getBuildDurationsTotal(3)
