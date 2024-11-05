/* animation speed in milliseconds */
const speed = 20;
const activityContainer = document.getElementsByClassName(
	'time-tracking-dashboard__activities'
)[0];

var currentTimeframe = 'daily';
var counters, activityData;
/* get all buttons for updating the activities */
let timeframeButtons = document.querySelectorAll('.btn-timeframe');
/* set an click event listener to update the activities */
timeframeButtons.forEach((btn) => {
	let type = btn.getAttribute('data-timeframe');

	btn.addEventListener('click', () => {
		document
			.querySelector('.btn-timeframe.active')
			.classList.remove('active');

		btn.classList.toggle('active');
		updateActivities(type);
	});
});

/* fetching json data */
async function fetchData() {
	const requestURL = './data.json';
	const request = new Request(requestURL);

	const response = await fetch(request);
	activityData = await response.json();
	/* populate the activity container with the different activities */
	await populateActivities(activityData);
	/* push all counter elements to an array for easier animation/updating */
	counters = document.querySelectorAll('.count');
	setTimeout(() => {
		updateActivities(currentTimeframe);
	}, 500);
}

/* populating the activities */
async function populateActivities(data) {
	//console.log('populateActivities');
	try {
		data.forEach((activity) => {
			appendActivity(activity);
		});
	} catch (err) {
		console.warn(
			'There was an error while trying to poplate the activities'
		);
	}
}

/* create the different activity fields and append them to the container */
const appendActivity = (activity) => {
	//console.log('append activity');
	const activityItem = document.createElement('div');
	const activityId = kebabCase(activity.title);
	activityItem.classList.add('activity-card', 'activity-card--' + activityId);
	activityItem.innerHTML = `
      <div class="activity-card__icon">
            <img src="./images/icon-${activityId}.svg" height="64" width="64" alt="icon of a briefcase" />
          </div>
          <div class="activity-card__info">
            <div class="header">
              <h2>${activity.title}</h2>
              <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                  fill="#BBC0FF" fill-rule="evenodd" />
              </svg>
            </div>
            <div class="current">
              <span data-target="${activity.timeframes[currentTimeframe].current}" class="count current" data-activity="${activity.title}">0</span>
              <span class="time">hrs</span>
            </div>
            <div class="previous">
              <span>Last&nbsp;</span>
              <span class="timeframe">week -&nbsp;</span>
              <span data-target="${activity.timeframes[currentTimeframe].previous}" class="count previous" data-activity="${activity.title}">0</span>
              <span class="time">hrs</span>
            </div>
          </div>
    `;
	activityContainer.appendChild(activityItem);
};

/* helper function to transform a string to kebab-case string*/
const kebabCase = (string) =>
	string
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();

function updateCounts() {
	//console.log('updateCounts');
	counters.forEach((counter) => {
		animateCount(counter);
	});
}
/* animate the count of the element from current to target */
const animateCount = (el) => {
	const target = el.getAttribute('data-target');
	const current = parseInt(el.innerText);

	if (current < target) {
		el.innerText = current + 1;
		setTimeout(animateCount.bind(null, el), speed);
	} else if (current > target) {
		el.innerText = current - 1;
		setTimeout(animateCount.bind(null, el), speed);
	} else {
		el.innerText = target;
	}
};

/* update the activities after selecting a specific timeframe */
function updateActivities(timeframe) {
	counters.forEach((counter) => {
		/* get the activity type (Work, Play, Study, ...*/
		let activityField = counter.getAttribute('data-activity');
		/* get the type of count (current || previous ) */
		let countType = counter.classList.contains('current')
			? 'current'
			: 'previous';
		/* set the new data-attribute of the count for the selected timeframe */
		counter.setAttribute(
			'data-target',
			activityData.filter((e) => e.title == activityField)[0].timeframes[
				timeframe
			][countType]
		);
		/* update the counters (-> animation) */
		animateCount(counter);
	});
}

/* fetch the json data */
fetchData();
