const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const cors = require('cors');
const crypto = require('crypto');
const e = require('express');
const OpenAI = require('openai');
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
db.query('SELECT 1', (err, results) => {
    if (err) console.error('Error running query:', err);
    else console.log('Database is working');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "docs")));




////////////////////////// REUSABLE FUNCTIONS //////////////////////////






////////////////////////// APIS ROUTES //////////////////////////
app.post("/api/get-ai-data", async (req, res) => {
    let prompt = req.body.prompt;

    const response = await openaiClient.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        text: {
            format: {
                type: "json_object"
            }
        }
    });
    let aiObj = JSON.parse(response.output_text);
    /*
    let aiObj = {
	"assurance_traps": [
		{
			"name": "Legalism",
			"heading": "The Legalism Trap",
			"description": "Believing God's acceptance, favor, and assurance of salvation depends primarily on rule-keeping and moral performance. Failure produces condemnation, while obedience becomes a basis for confidence.",
			"score": 18
		},
		{
			"name": "Perfectionism",
			"heading": "The Perfectionism Trap",
			"description": "Believing assurance depends on achieving near-sinless performance. Every failure becomes evidence of being unsaved rather than evidence of ongoing need for grace and growth.",
			"score": 42
		},
		{
			"name": "Introspection Addiction",
			"heading": "Introspection Addiction",
			"description": "Constantly analyzing motives, emotions, repentance, or spiritual experiences. Assurance becomes rooted in self-examination rather than trust in God's promises and character.",
			"score": 81
		},
		{
			"name": "Feelings-Based Assurance",
			"heading": "Feelings-Based Assurance",
			"description": "Measuring salvation by recent obedience, ministry activity, Bible reading, prayer consistency, or victory over sin rather than by faith in Christ.",
			"score": 29
		},
		{
			"name": "Comparison Trap",
			"heading": "The Comparison Trap",
			"description": "Comparing oneself to seemingly more mature Christians. Others' gifts, zeal, experiences, or holiness become the standard for evaluating one's salvation.",
			"score": 11
		},
		{
			"name": "Re-Salvation Cycle",
			"heading": "The Re-Salvation Cycle",
			"description": "Repeatedly seeking conversion experiences, re-praying salvation prayers, or recommitting because previous professions of faith never feel certain enough.",
			"score": 7
		},
	],

	"evidences_of_salvation": [
		{
			"quote": "Since trusting Christ, I genuinely desire to obey Him even though I still fail.",
			"label": "New desires"
		},
		{
			"quote": "When I sin, I want to confess it and return to Christ instead of living comfortably in it.",
			"label": "Repentance"
		},
		{
			"quote": "I believe Jesus alone paid for my sins and that my hope is in Him, not myself.",
			"label": "Faith in Christ"
		},
		{
			"quote": "I have grown in love for other believers and enjoy learning God's Word.",
			"label": "Spiritual growth"
		},
	],

	"sources_of_assurance": [
		{
			"name": "God's Promises",
			"label": "God's Promises",
			"description": "Resting confidence on God's explicit promises in Scripture that everyone who trusts in Christ has eternal life. Assurance flows from God's faithfulness.",
			"good": true,
			"percentage": 35
		},
		{
			"name": "Evidence of Spiritual Growth",
			"label": "Growth",
			"description": "Recognizing gradual transformation, growing obedience, repentance, and love for God as supporting evidence of genuine spiritual life and faith.",
			"good": true,
			"percentage": 25
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
			"percentage": 15
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
		"percentage": 25,
		"description": "Though sincere faith is evident, recurring self-examination and sensitivity toward sin have weakened confidence, causing assurance to fluctuate more than Scripture alone would warrant."
	},

	"scripture": {
		"bible_verses": [
			{
				"verse": "I give them eternal life, and they shall never perish; no one will snatch them out of my hand.",
				"reference": "John 10:28"
			},
			{
				"verse": "Whoever comes to me I will never cast out.",
				"reference": "John 6:37"
			},
			{
				"verse": "Therefore, since we have been justified by faith, we have peace with God through our Lord Jesus Christ.",
				"reference": "Romans 5:1"
			}
		],
		"description": "These passages direct assurance away from changing emotions and toward Christ's finished work, reminding believers that salvation rests upon His promises, faithful character, and sufficient grace alone."
	},

	"ai_response": "Thank you for sharing your testimony so honestly. Your answers suggest that your greatest struggle is not a lack of desire for Christ but a tendency to continually examine yourself for certainty. While self-examination has a biblical place, it was never meant to become the foundation of assurance. Your testimony contains encouraging evidence of genuine faith: trust in Christ's sacrifice, repentance when you sin, spiritual growth, and love for God and His people. These are consistent with the work of the Holy Spirit. Rather than looking inward every day to determine whether you are saved, continue looking outward to Christ and His promises. Your confidence should ultimately rest in what Jesus has accomplished, not in the perfection of your repentance, your feelings, or your recent performance. When doubts arise, answer them with Scripture rather than endless analysis, remembering that Christ saves all who truly come to Him."
    }
    */

    return res.json({ object: aiObj });
});

app.post("/api/ai-message", async (req, res) => {
    let prompt = req.body.prompt;

    const response = await openaiClient.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
    });
    let aiReply = response.output_text;
	return res.json({ reply: aiReply });
	/*
	setTimeout(() => {
		return res.json({ reply: "Hi, thanks for the mesage!" });
	}, 1000);
	*/
});

app.post("/api/save-data", (req, res) => {
	const { questionData, testimony, aiObject, userId } = req.body;

	db.query("insert into users (user_id, question_data, testimony, ai_object) values (?, ?, ?, ?)", [userId, questionData, testimony, aiObject], (err, result) => {
		if(err){
			console.error(err);
		}

		return res.json({ message: 'success' });
	});
});

app.post("/api/get-saved-report", (req, res) => {
	const userId = req.body.userId;

	db.query("select * from users where user_id = ?", [userId], (err, result) => {
		if(err){
			console.error(err);
		}

		return res.json({ questionData: JSON.parse(result[0].question_data), aiObject: JSON.parse(result[0].ai_object), testimony: result[0].testimony });
	});
});





app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});