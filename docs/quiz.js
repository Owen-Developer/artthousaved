

let params = new URLSearchParams(window.location.search);
let url = "https://artthousaved.onrender.com";
let questionData;
let cheat = 0;
let currentSectionIdx = cheat;
let currentQuestionIdx = cheat;
let currentSectionArray;
let assurancePercentage = 0;
let isStorySent = false;
let isResponding = false;

let currentMsgRate;
if(!localStorage.getItem("msgRate")){
	currentMsgRate = 0;
} else {
	currentMsgRate = localStorage.getItem("msgRate");
}

async function loadQuestions() {
    try {
        const response = await fetch("/quiz.json");
        const data = await response.json();

		questionData = data;
		currentSectionArray = data[cheat];
	} catch (error) {
        console.error(error);
    }
}
loadQuestions();
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}


function nextQuestion(){
	if(document.querySelector(".ques-wrapper-active")){
		updateAnswers();
		if(currentSectionIdx == 2 && currentQuestionIdx == 0){
			assurancePercentage = 100 - ((Number(document.querySelector(".ques-wrapper-active .ques-letter").textContent) - 1) * 20);
		}
		currentQuestionIdx++;
		if(currentQuestionIdx >= currentSectionArray.length){
			currentSectionIdx++;
			currentQuestionIdx = 0;
			currentSectionArray = questionData[currentSectionIdx];
		}
		if(currentSectionIdx == 3){
			switchContainers(document.querySelector(".ques-container"), document.querySelector(".chat-container"));
			highlightPanelCircles();
		} else {
			showQuestion();
		}
	}
}

function previousQuestion(){
	if(currentSectionIdx != 0 || currentQuestionIdx != 0){
		currentQuestionIdx--;
		if(currentQuestionIdx == -1){
			currentSectionIdx--;
			currentSectionArray = questionData[currentSectionIdx];
			currentQuestionIdx = currentSectionArray.length - 1;
		}
		showQuestion();
	}
}

async function showQuestion(){
	highlightPanelCircles();
	document.querySelector(".ques-container").style.opacity = "0";
	await sleep(300);
	let currentQuestion = currentSectionArray[currentQuestionIdx];
	document.querySelector(".ques-title").textContent = currentQuestion.question;
	document.querySelectorAll(".ques-bar span").forEach((bar, idx) => {
		bar.classList.remove("ques-bar-active");
		if(idx < currentSectionArray.length){
			bar.style.display = "block";
			if(idx <= currentQuestionIdx){
				bar.classList.add("ques-bar-active");
			}
		} else {
			bar.style.display = "none";
		}
	});
	document.querySelectorAll(".ques-wrapper").forEach((wrapper, idx) => {
		wrapper.classList.remove("ques-wrapper-active");
		if(idx < currentQuestion.choices.length){
			wrapper.style.display = "flex";
		} else {
			wrapper.style.display = "none";
		}
		wrapper.querySelector(".ques-txt").textContent = currentQuestion.choices[idx];
	});
	await sleep(50);
	document.querySelector(".ques-container").style.opacity = "1";
}
showQuestion();

async function sendStory(){if(!isResponding){
	if(currentMsgRate < 50){
		document.querySelector(".chat-input-btn").onclick = sendMessage;
		isResponding = true;
		isStorySent = true;
		document.querySelector(".conv-human").textContent = document.getElementById("chatInputArea").value;
		document.querySelector(".chat-input-background").style.transition = "0.3s ease";
		document.querySelector(".chat-input-background").classList.remove("chat-input-start");
		await switchContainers(document.querySelector(".init-content"), document.querySelector(".conv-container"));
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: "smooth"
		});
		aiLoading();
		let aiObject = await getAiData();
		let aiResponse = `${aiObject.ai_response} Click <span>here</span> to view your report.`;
		displayReport(aiObject);
		document.querySelector(".chat-input-report").style.opacity = "1";
		document.querySelector(".chat-input-report").style.pointerEvents = "auto";
	
		document.querySelector(".conv-ai").innerHTML = "";
		showAiText(aiResponse, document.querySelector(".conv-ai"));
		let currentMsgRate = Number(localStorage.getItem("msgRate")) + 1;
		localStorage.setItem("msgRate", currentMsgRate);
	} else {
		document.getElementById("chatInputArea").value = "Sorry, you have used up all of your AI messages.";
		setTimeout(() => {
			document.getElementById("chatInputArea").value = "";
		}, 2000);
	}
}}

async function getAiData(){
	let inputValue = document.getElementById("chatInputArea").value;
	document.getElementById("chatInputArea").value = "";
	questionData.forEach(section => {
		section.forEach(question => {
			delete question.choices;
		});
	});

	let analyticsData = {
		"assurance_traps": [
			{
				"name": "Legalism",
				"heading": "The Legalism Trap",
				"description": "Believing that salvation depends primarily on rule-keeping and moral performance. Failure produces condemnation, while obedience becomes a weak basis for confidence.",
				"score": 0 // each score out of 100
			},
			{
				"name": "Perfectionism",
				"heading": "The Perfectionism Trap",
				"description": "Believing that saving faith requires near-sinless performance. Every failure becomes evidence of being unsaved rather than evidence of ongoing need for grace and growth.",
				"score": 0
			},
			{
				"name": "Introspection Addiction",
				"heading": "The Introspection Addiction",
				"description": "Constantly analyzing motives, emotions, repentance, or spiritual experiences. Assurance becomes rooted in self-examination rather than trust in God's promises and character.",
				"score": 0
			},
			{
				"name": "Feelings-Based Assurance",
				"heading": "Feelings-Based Assurance",
				"description": "Measuring your salvation by your feelings, emotions and prayer consistency rather than by faith in Christ. As joy rises and falls, assurance rises and falls.",
				"score": 0
			},
			{
				"name": "Comparison Trap",
				"heading": "The Comparison Trap",
				"description": "Comparing oneself to seemingly more mature Christians. Others' gifts, zeal, experiences, or holiness become the standard for evaluating one's salvation.",
				"score": 0
			},
			{
				"name": "Re-Salvation Cycle",
				"heading": "The Re-Salvation Cycle",
				"description": "Repeatedly seeking conversion experiences, re-praying salvation prayers, or recommitting because previous professions of faith never feel certain enough.",
				"score": 0
			},
		],

		"evidences_of_salvation": [
			{
				"quote": "", // something the user said in their testimony
				"label": "" // short words to show why it is evidence, e.g. "Spiritual transformation"
			},
			{
				"quote": "",
				"label": ""
			},
			{
				"quote": "",
				"label": ""
			},
			{
				"quote": "",
				"label": ""
			},
		],

		"sources_of_assurance": [
			{
				"name": "God's Promises",
				"label": "God's Promises",
				"description": "Resting confidence on God's explicit promises in Scripture that everyone who trusts in Christ has eternal life. Assurance flows from God's faithfulness.",
				"good": true,
				"percentage": 30
			},
			{
				"name": "Evidence of Spiritual Growth",
				"label": "Growth",
				"description": "Recognizing gradual transformation, growing obedience, repentance, and love for God as supporting evidence of genuine spiritual life and faith.",
				"good": true,
				"percentage": 20
			},
			{
				"name": "Religious Performance",
				"label": "Performance",
				"description": "Basing confidence primarily on Bible reading, prayer, ministry involvement, church attendance, or moral achievements instead of Christ's saving work.",
				"good": false,
				"percentage": 15
			},
			{
				"name": "Spiritual Feelings",
				"label": "Feelings",
				"description": "Relying on emotional experiences, spiritual excitement, or felt closeness to God. Assurance fluctuates whenever emotions rise or fall.",
				"good": false,
				"percentage": 10
			},
			{
				"name": "Past Experiences Alone",
				"label": "Experiences",
				"description": "Trusting solely in a past conversion event, prayer, or experience while neglecting present faith and ongoing relationship with Christ.",
				"good": false,
				"percentage": 10
			}
		],

		"initial_assurance": {
			"percentage": assurancePercentage, // this is pre-set by the user, do not change
			"description": "" // 28 words based on their testimony and initial assurance %
		},

		"scripture": {
			"bible_verses": [
				{
					"verse": "", // quote from bible
					"reference": "" // e.g. John 3:16
				},
				{
					"verse": "",
					"reference": ""
				},
				{
					"verse": "",
					"reference": ""
				},
			],
			"description": "", // 31 word description/application of verses
		},

		"ai_response": "", // response encouraging the user and discussing their assurance/doubt of salvation, their quiz answers, their testimony, and whatever issues they have.
	}
	let promptTxt = `
		You are an AI bot for a Christian app where users can find out whether they are truly saved or not, and have assurance of salvation if they are saved.

		Your job is to:
		1. analyse the user's quiz answers and testimony I have shown you
		2. generate accurate JSON data for the user's condition in the format I have shown you

		The user's quiz answers: ${JSON.stringify(questionData)}

		The user's testimony: ${inputValue}

		Return ONLY valid JSON in this format: ${JSON.stringify(analyticsData)}
		- for "assurance_traps" give each score out of 100 based on the user's answers/testimony (try to keep one trap dominant)
		- for "evidences_of_salvation" give each a quote from the user's testimony, and a label as for why the quote gives evidence e.g. "Spiritual transformation"
		- for "sources_of_assurance" fill in the percentages so they all add up to 100
		- for "initial_assurance" the percentage is pre-set by the user, so do not change. The description needs to be 28 words based on their testimony and initial assurance % (so use past tense) (you are talking TO the user)
		- for "scripture" the "verse" is the quote from the bible, and the referencce is e.g. "John X:YZ". Then a 31 word description/application of those verses (you are talking TO the user)
		- for "ai_response" give a response to the user and discussing their assurance/doubt of salvation, their quiz answers, their testimony, and whatever issues they have, with a slightly encouraging tone. You need to reply in HTML form. That means: add <br><br> where its needed, add <b>(text)</b> where bold text is needed, not "**(text)**", etc
	`;

	const dataToSend = { prompt: promptTxt };
	try {
		const response = await fetch(url + `/api/get-ai-data`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
			},
			body: JSON.stringify(dataToSend), 
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Error:', errorData.message);
			return;
		}

		const data = await response.json();
		let aiObj = data.object;
		saveData(JSON.stringify(questionData), inputValue, JSON.stringify(aiObj));
		return aiObj;
	} catch (error) {
		console.error('Error posting data:', error);
	}
}

function displayReport(aiObject){
	let orderedTraps = orderArray(aiObject.assurance_traps, "score");
	document.querySelector(".ana-circ-head").textContent = orderedTraps[0].score + "%";
	document.querySelector(".dom-head").textContent = orderedTraps[0].heading;
	document.querySelector(".dom-para").textContent = orderedTraps[0].description;

	orderedTraps.forEach((trap, idx) => {
		document.querySelectorAll(".tra-txt")[idx].innerHTML = `<div>${trap.name}</div><div>${trap.score}%</div>`;
		document.querySelectorAll(".tra-bar span")[idx].style.width = trap.score + "%";

		document.querySelectorAll(".tra-section")[idx].addEventListener("click", () => {
			document.querySelectorAll(".tra-section").forEach(other => {
				other.classList.remove("tra-active");
			});
			document.querySelectorAll(".tra-section")[idx].classList.add("tra-active");
			document.querySelector(".ana-circ-head").textContent = orderedTraps[idx].score + "%";
			document.querySelector(".dom-head").textContent = orderedTraps[idx].heading;
			document.querySelector(".dom-para").textContent = orderedTraps[idx].description;
			let offset = 282.74 * (1 - orderedTraps[idx].score / 100);
			document.querySelector(".dom-fill").style.strokeDashoffset = offset;
		});
	});

	aiObject.evidences_of_salvation.forEach((evi, idx) => {
		document.querySelectorAll(".evi-quote")[idx].textContent = `"${evi.quote}"`;
		document.querySelectorAll(".evi-txt")[idx].innerHTML = `<span></span> ${evi.label}`;
	});

	let orderedSources = orderArray(aiObject.sources_of_assurance, "percentage");
	orderedSources.forEach((source, idx) => {
		document.querySelectorAll(".src-li")[idx].innerHTML = `<span></span> ${source.percentage}% ${source.name}`;
		if(source.good){
			document.querySelectorAll(".src-li")[idx].classList.add("src-li-good");
		}
	});

	let labels = [];
	orderedSources.forEach(source => labels.push(source.label));
	let percentages = [];
	orderedSources.forEach(source => percentages.push(source.percentage));
	const data = {
		labels: labels,
		datasets: [
			{
			data: percentages,
			fill: true,
			backgroundColor: 'hsla(34, 77%, 51%, 0.2)',
			borderColor: 'hsl(34, 77%, 51%)',
			pointBackgroundColor: 'hsl(34, 77%, 51%)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(255, 99, 132)'
			}
		]
	};
	generateRadar(data);

	document.querySelectorAll(".cmp-number")[0].textContent = aiObject.initial_assurance.percentage + "%";
	document.querySelectorAll(".cmp-number")[1].innerHTML = `<div>${aiObject.initial_assurance.percentage}%</div> <span>how assured are you know?`;
	document.querySelector(".cmp-audio-bar span").style.width = aiObject.initial_assurance.percentage + "%";
	document.querySelector(".cmp-audio-bar div").style.left = aiObject.initial_assurance.percentage + "%";
	document.getElementById("cmpRange").value = aiObject.initial_assurance.percentage;
	document.querySelector(".cmp-txt").textContent = aiObject.initial_assurance.description;

	document.querySelector(".bib-quote").textContent = `"${aiObject.scripture.bible_verses[0].verse}"`;
	document.querySelector(".bib-verse").innerHTML = `${aiObject.scripture.bible_verses[0].reference} <span></span> NIV`;
	document.querySelector(".bib-txt").textContent = aiObject.scripture.description;
	aiObject.scripture.bible_verses.forEach((verse, idx) => {
		document.querySelectorAll(".bib-scripture span")[idx].textContent = verse.reference;

		document.querySelectorAll(".bib-scripture span")[idx].addEventListener("click", () => {
			document.querySelectorAll(".bib-scripture span").forEach(other => {
				other.classList.remove("bib-scripture-active");
			});
			document.querySelectorAll(".bib-scripture span")[idx].classList.add("bib-scripture-active");
			document.querySelector(".bib-quote").textContent = `"${aiObject.scripture.bible_verses[idx].verse}"`;
			document.querySelector(".bib-verse").innerHTML = `${aiObject.scripture.bible_verses[idx].reference} <span></span> NIV`;
		});
	});
}

async function sendMessage(){if(!isResponding){
	if(currentMsgRate < 50){
		let newHuman = document.createElement("div");
		newHuman.classList.add("conv-human");
		newHuman.style.opacity = "1";
		newHuman.textContent = document.getElementById("chatInputArea").value;
		document.getElementById("chatInputArea").value = "";
		let newAi = document.createElement("div");
		newAi.classList.add("conv-ai");
		newAi.innerHTML = `
			<div class="ai-loading-container">
				<div class="ai-loading">Thinking...</div>
			</div>
		`;
		document.querySelectorAll(".conv-ai")[document.querySelectorAll(".conv-ai").length - 1].style.minHeight = "0px";
	
		document.querySelector(".conv-container").insertBefore(newHuman, document.getElementById("chatInputHeight"));
		document.querySelector(".conv-container").insertBefore(newAi, document.getElementById("chatInputHeight"));
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: "smooth"
		});
	
		let previousMessages = [];
		document.querySelectorAll(".conv-human").forEach((txt, idx) => {
			if(idx > 0 && idx != document.querySelectorAll(".conv-human").length - 1){
				previousMessages.push(txt.textContent);
			} 
		});
	
		let promptTxt = `
			You are an AI chatbot for a Christian app where users can find out whether they are truly saved or not, and have assurance of salvation if they are saved.
	
			Your current job is to reply to a message the user has sent you in chat. 
	
			You need to reply in HTML form. That means:
			- add <br><br> where its needed
			- add <b>(text)</b> where bold text is needed, not "**(text)**"
			- etc
	
			This is the user's testimony, for context:
			"${document.querySelectorAll(".conv-human")[0].textContent}"
	
			Here is their previous messages, for context:
			"${previousMessages.join(" ")}"
	
			*IMPORTANT* This is the question you need to answer in chat:
			"${newHuman.textContent}"
		`;
		const dataToSend = { prompt: promptTxt };
		try {
			const response = await fetch(url + `/api/ai-message`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json', 
				},
				body: JSON.stringify(dataToSend), 
			});
	
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error:', errorData.message);
				return;
			}
	
			const data = await response.json();
			showAiText(data.reply);
			let currentMsgRate = Number(localStorage.getItem("msgRate")) + 1;
			localStorage.setItem("msgRate", currentMsgRate);
		} catch (error) {
			console.error('Error posting data:', error);
		}
	} else {
		document.getElementById("chatInputArea").value = "Sorry, you have used up all of your AI messages.";
		setTimeout(() => {
			document.getElementById("chatInputArea").value = "";
		}, 2000);
	}
}}


///////////////// SMALL FUNCTIONS //////////////////
async function highlightPanelCircles(){
	document.querySelectorAll(".seq-flex").forEach((sect, idx) => {
		if(idx < currentSectionIdx){
			sect.classList.remove("seq-active");
			sect.classList.add("seq-completed");
		} else if(idx == currentSectionIdx){
			sect.classList.add("seq-active");
			sect.classList.remove("seq-completed");
		} else {
			sect.classList.remove("seq-active");
			sect.classList.remove("seq-completed");
		}
	});
	await sleep(300);
	document.querySelector(".ques-section-txt").textContent = document.querySelectorAll(".seq-head")[currentSectionIdx].textContent;
}
async function switchContainers(hide, show){
	hide.style.opacity = "0";
	show.style.opacity = "0";
	await sleep(300);
	hide.classList.add("none");
	show.classList.remove("none");
	if(show.classList.contains("chat-container")){
		setChatWidth();
	}
	if(show.classList.contains("rep-container")){
		currentSectionIdx = 4;
	}
	await sleep(50);
	show.style.opacity = "1";
}
function setChatWidth(){
	let chatBackground = document.querySelector(".chat-input-background");
	let chatContainer = document.querySelector(".chat-container");
	chatBackground.style.width = chatContainer.getBoundingClientRect().width + "px";
}
/*
document.getElementById("chatInputArea").addEventListener("input", () => {
	let chatInputArea = document.getElementById("chatInputArea");
	let chatInputContainer = document.getElementById("chatInputContainer");
	let chatInputHeight = document.getElementById("chatInputHeight");
	let originalHeight = chatInputContainer.getBoundingClientRect().height;

	if(chatInputArea.scrollHeight > 0 && chatInputArea.getBoundingClientRect().height < 30){
		chatInputArea.style.height = chatInputArea.scrollHeight + "px";
	}
	if(chatInputArea.value == ""){
		chatInputArea.style.height = "50px";
	}
	chatInputHeight.style.height = Number(chatInputContainer.getBoundingClientRect().height + 80) + "px";
	let changeAmount = originalHeight - chatInputContainer.getBoundingClientRect().height;
	chatInputContainer.style.transform = `translateY(${changeAmount}px)`;
	console.log(originalHeight, chatInputContainer.getBoundingClientRect().height);
});
*/
document.getElementById("chatInputArea").addEventListener("keydown", (e) => {
	if(e.key == "Enter" && !e.shiftKey){
		e.preventDefault();
		if(document.getElementById("chatInputArea").value != ""){
			if(isStorySent){
				sendMessage();
			} else {
				sendStory();
			}
		}
	}
});
document.querySelectorAll(".ques-wrapper").forEach(wrapper => {
	wrapper.addEventListener("click", () => {
		document.querySelectorAll(".ques-wrapper").forEach(other => {
			other.classList.remove("ques-wrapper-active");	
		});
		wrapper.classList.add("ques-wrapper-active");
	});
});
function updateAnswers(){
	questionData[currentSectionIdx][currentQuestionIdx].answer = document.querySelector(".ques-wrapper-active .ques-txt").textContent;
	console.log(questionData);
}
function aiLoading(){
	let loadingTxt = [
		"Thinking...",
		"analyzing your quiz answers...",
		"analyzing your testimony...",
		"generating data and analytics...",
	];
	let currentContainer = document.querySelectorAll(".ai-loading-container")[document.querySelectorAll(".ai-loading-container").length - 1];
	console.log(document.querySelectorAll(".ai-loading-container"));
	currentContainer.querySelectorAll(".ai-dot span").forEach((dot, idx) => {
		setTimeout(() => {
			if(currentContainer.querySelector(".ai-loading")){
				if(currentContainer.querySelector(".ai-dot-active")) currentContainer.querySelector(".ai-dot-active").classList.remove("ai-dot-active");
				dot.classList.add("ai-dot-active");
				currentContainer.querySelector(".ai-loading").textContent = loadingTxt[idx];
			}
		}, 5000 * idx);
	});
}
function orderArray(array, variable){
	let newArray = [];
	for(let i = 100; i >= 0; i--){
		array.forEach(item => {
			if(item[variable] == i){
				newArray.push(item);
			}
		});
	}
	return newArray;
}
function generateRadar(data){
	const ctx = document.getElementById('myRadar');

	const config = {
	type: 'radar',
	data: data,
	options: {
		responsive: true,
		maintainAspectRatio: false,

		elements: {
		line: {
			borderWidth: 3
		}
		},

		scales: {
		r: {
			suggestedMin: 0,
			suggestedMax: data.datasets[0].data[0],
			ticks: {
			stepSize: 10
			},
			grid: {
			color: 'rgba(200, 200, 200, 0.65)'
			},
			angleLines: {
			color: 'rgba(200, 200, 200, 0.65)'
			}
		}
		},

		plugins: {
		legend: {
			position: 'none',
		}
		}
	}
	};

	new Chart(ctx, config);
}
document.getElementById("cmpRange").addEventListener("input", (e) => {
	document.querySelector(".cmp-audio-bar span").style.width = Number(e.target.value * 100) + "%";
	document.querySelector(".cmp-audio-bar div").style.left = Number(e.target.value * 100) + "%";
	document.querySelectorAll(".cmp-number")[1].innerHTML = `<div>${Number(e.target.value * 100).toFixed(0)}%</div> <span>how assured are you know?`;
	localStorage.setItem("postAssurance", Number(e.target.value * 100).toFixed(0));
});
document.querySelector(".rep-btn-ai").addEventListener("click", () => {
	switchContainers(document.querySelector(".rep-container"), document.querySelector(".chat-container"));
});
document.querySelector(".chat-input-report").addEventListener("click", async () => {
	await switchContainers(document.querySelector(".chat-container"), document.querySelector(".rep-container"));
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
});
function showAiText(aiResponse){
	for(let i = 1; i <= aiResponse.length; i++){
		setTimeout(() => {
			let convAi = document.querySelectorAll(".conv-ai")[document.querySelectorAll(".conv-ai").length - 1];
			convAi.innerHTML = aiResponse.slice(0, i);
			
			if(i == aiResponse.length && convAi.querySelector("span")){
				convAi.querySelector("span").addEventListener("click", () => {
					switchContainers(document.querySelector(".chat-container"), document.querySelector(".rep-container"));
					highlightPanelCircles();
					setTimeout(() => {
						window.scrollTo({
							top: 0,
							behavior: "smooth"
						});
					}, 300);
				});
			} 
			if(i == aiResponse.length){
				isResponding = false;
			}
		}, i * 2);
	}
}
async function trapGuidance(){
	await switchContainers(document.querySelector(".rep-container"), document.querySelector(".chat-container"));
	let currentTrap = document.querySelector(".dom-head").textContent;
	document.getElementById("chatInputArea").value = `My report suggests that I struggle with "${currentTrap}". Can you explain what this means biblically, why it undermines assurance, and how I can overcome this trap and improve my assurance?`;
	sendMessage();
}
async function saveData(questionData, testimony, aiObject){
	let userId = Math.floor(100000 + Math.random() * 900000);
	localStorage.setItem("userId", userId);
	const dataToSend = { questionData: questionData, testimony: testimony, aiObject: aiObject, userId: userId };
	try {
		const response = await fetch(url + `/api/save-data`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
			},
			body: JSON.stringify(dataToSend), 
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Error:', errorData.message);
			return;
		}

		const data = await response.json();
	} catch (error) {
		console.error('Error posting data:', error);
	}
}

if(params.get("report")){
	switchContainers(document.querySelector(".ques-container"), document.querySelector(".rep-container"));
	switchContainers(document.querySelector(".init-content"), document.querySelector(".conv-container"));
	currentSectionIdx = 4;
	highlightPanelCircles();

	async function getSavedReport(){
		const dataToSend = { userId: localStorage.getItem("userId") };
		try {
			const response = await fetch(url + `/api/get-saved-report`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json', 
				},
				body: JSON.stringify(dataToSend), 
			});
	
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error:', errorData.message);
				return;
			}
	
			const data = await response.json();
			displayReport(data.aiObject);
			document.querySelector(".conv-human").textContent = data.testimony;
			document.querySelector(".conv-ai").innerHTML = data.aiObject.ai_response;
			document.querySelector(".chat-input-report").style.opacity = "1";
			document.querySelector(".chat-input-report").style.pointerEvents = "auto";
			document.querySelector(".chat-input-background").classList.remove("chat-input-start");
			document.querySelector(".chat-input-btn").onclick = sendMessage;
			isStorySent = true;
		} catch (error) {
			console.error('Error posting data:', error);
		}
	}
	getSavedReport();
}