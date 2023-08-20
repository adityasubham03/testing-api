const express = require("express");
const { set, connect, model, Schema } = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { DB, REQUEST_TIMEOUT, PORT } = require("./config/db");

//Routes Imports


const app = express();


//CORS Definition
app.use(
	cors({
		credentials: true,
		origin: ['https://mlsa.unknownclub.me','http://localhost:5173','https://registrations-mlsa.vercel.app'],
	})
);

//For getting req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Api Endpoints


app.post("/", (req, res, next) => {
	res.send({
		message: "POST request is not allowed in this endpoint!!",
		success: false,
	});
});

app.get("/api/health", (req, res) => {
	res.send({
		message: "Server is Up and running",
		success: true,
	});
});


//Registrations MongoDB Schema
const registrationSchema = new Schema({
    name: {
        type: String,
    },
    rollNumber: {
        type: String,
    },
    currentYear: {
        type: String,
    },
    branch: {
        type: String,
    },
    kiitEmailId: {
        type: String,
    },
    personalEmailId: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    interestedField1: {
        type: String,
    },
    interestedField2: {
        type: String,
    },
    interestedField3: {
        type: String,
    },
    linkedin: {
        type: String,
        default: "None Given",
    },
    github: {
        type: String,
    },
    expectation: {
        type: String,
        default: "None Given",
    },
    ip: {
        type: String,
    },
    host: {
        type: String,
    },
    userAgent: {
        type: String,
    }
}, { timestamps: true });

const reg = model('registration', registrationSchema);


//API Endpoints for registrations
app.post("/api/register", async (req, res) => {
    try {
        const { name, rollNumber, currentYear, branch, kiitEmailId, personalEmailId, phoneNumber, interestedField1,interestedField2,interestedField3, linkedin, github, expectation } = req.body;
        const ip = req.ip;
        const host = req.get('host');
        const userAgent = req.get('user-agent');
        const existingRegistrations = await reg.findOne({ kiitEmailId: kiitEmailId });
        if (existingRegistrations) {
            return res.status(409).json({ message: "User already registered" });
        }
        
        const registration = new reg({
            name, rollNumber, currentYear, branch, kiitEmailId, personalEmailId, phoneNumber, interestedField1,interestedField2,interestedField3, linkedin, github, expectation,
            ip,
            host,
            userAgent,
        });
        await registration.save();
        return res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        let errorMsg = "Invalid Data";

        return res.status(err.status || 400).json({ message: errorMsg });
    }

})


app.use((req, res) => {
	res.status(404).json({
		reason: "invalid-request",
		message:
			"The endpoint you wanna reach is not available! Please check the endpoint again",
		success: false,
	});
});



//Database configuration and connection
const startApp = async () => {
	try {
		// Connection With DB
		await connect(DB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: REQUEST_TIMEOUT,
		});

		console.log("Successfully connected with the Database");

		// Start Listenting for the server on PORT
		app.listen(PORT, async () => {
			console.log("Successfully connected with the port 5000");
		});
	} catch (err) {
		console.log("unable to connect with the Database");
		startApp();
	}
};

startApp();
