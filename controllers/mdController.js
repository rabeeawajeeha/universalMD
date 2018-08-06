var express = require("express");
var router = express.Router();
var umd = require("../models/umdModel.js");

router.get("/", function (req, res) {
    umd.all(function (data) {
        console.log(data);
        var hasObject = {
            doctors: JSON.stringify(data)
        };
        console.log(hasObject);
        res.render("index");
    });

});

router.get("/form", function (req, res) {
    res.render("form");
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.get("/register", function (req, res) {
    res.render("register");
});

// function redirect1(el){
router.get("/dashboard", function (req, res) {
    var category = req.session.patients;
    console.log("test: " + JSON.stringify(category.symptoms));
    var docObject = [];
    var x = getDoctorAlgorithm(category.symptoms);
    console.log("-------------");
    console.log(x);
    Object.keys(x).forEach(a=>{
        switch(a){
            case 'checkGen':
            docObject['G.P']=x[a];
            break;
            case 'checkDent':
            docObject['Dentist']=x[a];
            break;
            case 'checkCardio':
            docObject['Cardiologist']=x[a];
            break;
            case 'checkNeuro':
            docObject['Neuorologist']=x[a];
            break;
        }
    });

    umd.matchDocs(tableArr, arr, function (result) {
        console.log(result);
    });

    renderDocs={
        
    }
    console.log(docObject);

    res.render("dashboard");
});

var getDoctorAlgorithm = function (choices) {
    var choiceArr = choices.split(",");
    console.log(choiceArr);
    let symptomObj = {
        genPrac: ["Fever", "Headache", "Skin Irritations", "Joint/Muscle Pain"],
        dentist: ["Toothache", "Broken Tooth"],
        cardiologist: ["Chest Pain", "Numbness"],
        neuorologist: ["Seisure", "Migrains"]
    }

    let currSymp = function (checkGen, checkDent, checkCardio, checkNeuro) {
        this.checkGen = {
                "length": checkGen.length,
                "value": 0,
                "field": checkGen
            },
            this.checkDent = {
                "length": checkDent.length,
                "value": 1,
                "field": checkDent
            },
            this.checkCardio = {
                "length": checkCardio.length,
                "value": 3,
                "field": checkCardio
            },
            this.checkNeuro = {
                "length": checkNeuro.length,
                "value": 3,
                "field": checkNeuro
            }
    }

    Object.keys(symptomObj).forEach(x => {
        switch (x) {
            case 'genPrac':
                console.log(x);
                checkGen = symptomObj[x].filter(y => choiceArr.includes(y));
                break;
            case 'dentist':
                checkDent = symptomObj[x].filter(y => choiceArr.includes(y));
                break;
            case 'cardiologist':
                checkCardio = symptomObj[x].filter(y => choiceArr.includes(y));
                break;
            case 'neuorologist':
                checkNeuro = symptomObj[x].filter(y => choiceArr.includes(y));
                break;
        }
    })

    //see which array is larger
    var newpatient = new currSymp(checkGen, checkDent, checkCardio, checkNeuro);
    console.log("++++++++++++++++");
    // console.log(newpatient);

    Object.keys(newpatient).forEach(x => {
        if (newpatient[x].length == 0) {
            delete newpatient[x];
        }
    });
    return newpatient;
}

/*===========================================posting data================================*/
router.post("/patients", function (req, res) {
    var tableArr = []; //col keys
    var valArr = JSON.stringify(req.body.symptoms); //just the symptoms
    // console.log(valArr);
    var allvals = [];
    Object.keys(req.body).forEach(x => {
        tableArr.push(x);
        allvals.push(req.body[x]);
    });
    console.log("symptoms are " + valArr);
    // console.log(allvals);
    var arr = [];
    getPatientCols(allvals, valArr);

    function getPatientCols(allval, vals) {
        for (var i = 0; i < allval.length - 1; i++) {
            arr.push(`"${allval[i]}"`); //pushes keys up to symptoms
        }
        arr.push(valArr);
    };
    // console.log(arr);
    umd.createPatient(tableArr, arr, function (result) {
        console.log(result);
    });
    req.session.patients = req.body;
    res.redirect("/dashboard");
});




module.exports = router;