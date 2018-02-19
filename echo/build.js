"use strict"

const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");

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

const importTypes = function() {
    const fileContent = fs.readFileSync(typesPath);
    const parsedContent = JSON.parse(fileContent);
    importObject[typesKey] = parsedContent;
};

const importIntents = function() {
    const fileContent = fs.readFileSync(intentsPath);
    const parsedContent = JSON.parse(fileContent);
    importObject[intentsKey] = parsedContent;
};

const importUtterances = function() {
    const fileContent = fs.readFileSync(utterancesPath, {encoding: "utf8"});
    importObject[samplesKey] = fileContent;
};

const buildCore = function() {
    exportObject[interactionModelKey] = {};
    exportObject[interactionModelKey][languageModelKey] = {};
    exportObject[interactionModelKey][invocationNameKey] = invocationNameValue;
};

// TODO: Implement custom synonyms
const buildTypes = function() {
    const typesArray = JSON.parse(JSON.stringify(importObject[typesKey]));
    exportObject[interactionModelKey][languageModelKey][typesKey] = typesArray;
};

const buildIntents = function() {
    const samplesArray = importObject[samplesKey].split("\n");
    const samplesObject = {};
    for (let samplesArrayIdx = 0; samplesArrayIdx < samplesArray.length; ++samplesArrayIdx) {
        const sampleLine = samplesArray[samplesArrayIdx].trim();
        const sampleSeperatorIdx = sampleLine.indexOf(" ");
        if (sampleLine.length > 0 && sampleSeperatorIdx > -1) {
            const sampleKey = sampleLine.slice(0, sampleSeperatorIdx);
            const sampleValue = sampleLine.slice(sampleSeperatorIdx + 1);
            if (!samplesObject[sampleKey]) {
                samplesObject[sampleKey] = [];
            }
            samplesObject[sampleKey].push(sampleValue);
        }
    }

    const intentsArray = JSON.parse(JSON.stringify(importObject[intentsKey]));
    for (let intentsArrayIdx = 0; intentsArrayIdx < intentsArray.length; ++intentsArrayIdx) {
        const intentObject = intentsArray[intentsArrayIdx];
        const intentSamplesArray = samplesObject[intentObject[intentNameKey]];
        intentObject[samplesKey] = intentSamplesArray ? intentSamplesArray : [];
    }

    exportObject[interactionModelKey][languageModelKey][intentsKey] = intentsArray;
};


const exportModel = function() {
    console.log("interactionModel: " + JSON.stringify(exportObject));
};

const start = function() {
    importTypes();
    importIntents();
    importUtterances();

    buildCore();
    buildTypes();
    buildIntents();

    exportModel();
};

start();