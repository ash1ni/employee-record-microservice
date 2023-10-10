const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config;
const session = require('express-session');

// Middleware for parsing JSON requests
app.use(express.json());

app.use(session({
    secret: 'abcdefgh123456',
    resave: false,
    saveUninitialized: false
  }))

// Passport middleware for user authentication
app.use(passport.initialize());
app.use(passport.session());


// Sample data structure to store records in memory
const records = [
    {
    "name": "Abhishek",
    "salary": "145000",
    "currency": "USD",
    "department": "Engineering",
    "sub_department": "Platform"
    },
    {
    "name": "Anurag",
    "salary": "90000",
    "currency": "USD",
    "department": "Banking",
    "on_contract": "true",
    "sub_department": "Loan"
    },
    {
    "name": "Himani",
    "salary": "240000",
    "currency": "USD",
    "department": "Engineering",
    "sub_department": "Platform"
    },
    {
    
    "name": "Yatendra",
    "salary": "30",
    "currency": "USD",
    "department": "Operations",
    "sub_department": "CustomerOnboarding"
    },
    {
    "name": "Ragini",
    "salary": "30",
    "currency": "USD",
    "department": "Engineering",
    "sub_department": "Platform"
    },
    {
    "name": "Nikhil",
    "salary": "110000",
    "currency": "USD",
    "on_contract": "true",
    "department": "Engineering",
    "sub_department": "Platform"
    },
    {
    "name": "Guljit",
    "salary": "30",
    "currency": "USD",
    "department": "Administration",
    "sub_department": "Agriculture"
    },
    {
    "name": "Himanshu",
    "salary": "70000",
    "currency": "EUR",
    "department": "Operations",
    "sub_department": "CustomerOnboarding"
    },
    {
    "name": "Anupam",
    "salary": "200000000",
    "currency": "INR",
    "department": "Engineering",
    "sub_department": "Platform"
    }
    ]


// Configure Passport.js for user authentication
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Implement your user authentication logic here
    // Example: Check if username and password match a user in your database
    if (username === "user" && password === "password") {
      return done(null, { id: 1, username: "user" });
    }
    return done(null, false, { message: "Incorrect username or password" });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Implement user deserialization here if needed
  done(null, { id: 1, username: "user" });
});

// Middleware for user authentication
app.use(passport.initialize());



app.post('/login', passport.authenticate('local'), (req, res) => {
    // Authentication successful; you can redirect or send a response here
    res.json({ message: "Login successful" });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: "Logout successful" });
  });
// Custom middleware for authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Authentication required" });
}

// API Endpoint to Get All Records (Requires Authentication)
app.get('/get-all-records', isAuthenticated, (req, res) => {
    res.json(records);
  });

// API Endpoint to Add a New Record (Requires Authentication)
app.post('/add-record', isAuthenticated, (req, res) => {
  try {
    const newRecord = req.body;
    records.push(newRecord);
    res.status(201).json({ message: "Record added successfully" });
  } catch (error) {
    res.status(500).json(error)
  }
   
});

// API Endpoint to Delete a Record (Requires Authentication)
app.delete('/delete-record/:recordId', isAuthenticated, (req, res) => {
  const recordId = req.params.recordId;
  const index = records.findIndex((record) => record.id === recordId);
  if (index !== -1) {
    records.splice(index, 1);
    res.json({ message: "Record deleted successfully" });
  } else {
    res.status(404).json({ message: "Record not found" });
  }
});

// Helper function to calculate summary statistics for an array of numbers
function calculateSummaryStats(numbers) {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return { mean, min, max };
}

// API Endpoint for Summary Statistics on Salary (Entire Dataset)
app.get('/summary-salary', isAuthenticated, (req, res) => {
  try {
    const salaries = records.map((record) => record.salary);
    const summary = calculateSummaryStats(salaries);
    res.json(summary);
  } catch (error) {
    res.status(500).json(error)
  }

});

// API Endpoint for Summary Statistics on Salary with "on_contract": "true"
app.get('/on-contract', isAuthenticated, (req, res) => {
    try {
        const onContractSalaries = records
        .filter((record) => record.on_contract === "true")
        .map((record) => record.salary);
      const summary = calculateSummaryStats(onContractSalaries);
      res.json(summary);
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
 
});

// API Endpoint for Summary Statistics on Salary by Department
app.get('/by-department', isAuthenticated, (req, res) => {
 try {
    const departmentSummary = {};
    records.forEach((record) => {
      const department = record.department;
      if (!departmentSummary[department]) {
        departmentSummary[department] = [];
      }
      departmentSummary[department].push(record.salary);
    });
  
    // Calculate summary statistics for each department
    for (const department in departmentSummary) {
      departmentSummary[department] = calculateSummaryStats(departmentSummary[department]);
    }
  
    res.json(departmentSummary);
 } catch (error) {
    res.status(500).json({message:"Internal Server Error"});
 }

});

// API Endpoint for Summary Statistics on Salary by Department and Sub-Department
app.get('/subdepartment-summary', isAuthenticated, (req, res) => {
    const departmentSubdepartmentSummary = {};
  
    records.forEach((record) => {
      const department = record.department;
      const subDepartment = record.sub_department;
      const key = `${department}_${subDepartment}`;
  
      if (!departmentSubdepartmentSummary[key]) {
        departmentSubdepartmentSummary[key] = [];
      }
      departmentSubdepartmentSummary[key].push(record.salary);
    });
  
    // Calculate summary statistics for each department and sub-department combination
    for (const key in departmentSubdepartmentSummary) {
      const [department, subDepartment] = key.split('_');
      const summary = calculateSummaryStats(departmentSubdepartmentSummary[key]);
      departmentSubdepartmentSummary[key] = {
        department,
        subDepartment,
        summary,
      };
    }
  
    res.json(Object.values(departmentSubdepartmentSummary));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
