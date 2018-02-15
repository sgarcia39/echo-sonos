"use strict"

const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");
const JSON5 = require("JSON5");

const processArguments = process.argv.slice(2);
const directoryPath = __dirname;
const typesPath = path.join(directoryPath, "types.json");
const intentsPath = path.join(directoryPath, "intents.json");
const utterancesPath = path.join(directoryPath, "utterances.txt");

const typesKey = "types";
const intentsKey = "intents";
const samplesKey = "samples";

const interactionModelKey = "interactionModel";
const languageModelKey = "languageModel";
const invocationNameKey = "invocationName";
const invocationNameValue = "beats";
const intentNameKey = "name";

const importObject = {};
const exportObject = {};

const loadTypes = function() {
    const fileContent = fs.readFileSync(typesPath);
    const parsedContent = JSON5.parse(fileContent);
    importObject[typesKey] = parsedContent;
};

const loadIntents = function() {
    const fileContent = fs.readFileSync(intentsPath);
    const parsedContent = JSON5.parse(fileContent);
    importObject[intentsKey] = parsedContent;
};

const loadUtterances = function() {
    const fileContent = fs.readFileSync(utterancesPath, {encoding: "utf8"});
    importObject[samplesKey] = fileContent;
};

const buildCore = function() {
    exportObject[interactionModelKey] = {};
    exportObject[interactionModelKey][languageModelKey] = {};
    exportObject[interactionModelKey][invocationNameKey] = invocationNameValue;
};

// TODO: Build value with synonyms feature
const buildTypes = function() {
    // INFO: Copy import types array
    const exportTypesArray = JSON.parse(JSON.stringify(importObject[typesKey]));
    exportObject[interactionModelKey][languageModelKey][typesKey] = exportTypesArray;
};

const buildIntents = function() {
    const samplesArray = importObject[samplesKey].split("\n");
    const samplesObject = {};
    for (let samplesArrayIdx = 0; samplesArrayIdx < samplesArray.length; ++samplesArrayIdx) {
        const sampleLine = samplesArray[samplesArrayIdx].trim();
        const sampleSeperatorIdx = sampleLine.indexOf(" ");
        if (sampleLine.length > 0 && sampleSeperatorIdx > -1) {
            let sampleKey = sampleLine.slice(0, sampleSeperatorIdx);
            let sampleValue = sampleLine.slice(sampleSeperatorIdx + 1);
            if (!samplesObject[sampleKey]) {
                samplesObject[sampleKey] = [];
            }
            samplesObject[sampleKey].push(sampleValue);
        }
    }

    // INFO : Copy import intents array
    const importIntentsArray = JSON.parse(JSON.stringify(importObject[intentsKey]));
    const exportIntentsArray = [];
    console.log(JSON.stringify(importObject));
    for (let importIntentsArrayIdx = 0; importIntentsArrayIdx < importIntentsArray.length; ++importIntentsArrayIdx) {
        const importIntentObject = importIntentsArray[importIntentsArrayIdx];
        // console.log(samplesObject[importIntentObject[intentNameKey]]);
        if (importIntentObject[intentNameKey] && samplesObject[importIntentObject[intentNameKey]]) {
            // console.log("foobar?");
            importIntentObject[samplesKey] = samplesObject[importIntentObject[intentNameKey]];
            exportIntentsArray.push(importIntentObject[samplesKey]);
        }
    }
    exportObject[interactionModelKey][languageModelKey][intentsKey] = exportIntentsArray;
};

const start = function() {
    loadTypes();
    loadIntents();
    loadUtterances();

    buildCore();
    buildTypes();
    buildIntents();

    // console.log(JSON.stringify(exportObject));
};

start();