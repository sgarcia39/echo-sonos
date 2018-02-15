var exec = require("child_process").exec;
var fse = require("fs-extra");
var path = require("path");

var directoryPath = __dirname;
var doxyPath = "/Doxyfile";
var exportPath = "/content/html/modules";

var localModulesPath = "/local_modules";
var localDistPaths = [
    "/cement/dist",
    "/prettify/dist"
];

var globalModulesPath = "/node_modules";
var globalDistPaths = [
    "/bootstrap/dist",
    "/jquery/dist",
    "/font-awesome"
];

var resolveBuild = function(callback) {
    var commandsArray = [
        "doxygen",
        "Doxyfile"
    ];

    var command = commandsArray.join(" ");
    console.log("resolveBuild.exec : " + command);

    exec(command, function(error, stdout, stderr) {
        if (error == null) {
            console.log("resolveBuild.success : " + stdout);
            callback();
        }
        else {
            console.log("resolveBuild.error : " + error);
        }
    });
};

var resolveGlobalExports = function () {
    for (var idx = 0; idx < globalDistPaths.length; ++idx)
    {
        moduleDistPath = directoryPath + globalModulesPath + globalDistPaths[idx];
        exportDistPath = directoryPath + exportPath + globalDistPaths[idx];
        fse.copySync(moduleDistPath, exportDistPath);
    }

    console.log("resolveGlobalExports.success");
};

var resolveLocalExports = function () {
    for (var idx = 0; idx < localDistPaths.length; ++idx)
    {
        moduleDistPath = directoryPath + localModulesPath + localDistPaths[idx];
        exportDistPath = directoryPath + exportPath + localDistPaths[idx];
        fse.copySync(moduleDistPath, exportDistPath);
    }

    console.log("resolveLocalExports.success");
};

var start = function() {
    resolveBuild(function() {
        resolveGlobalExports();
        resolveLocalExports();
        console.log("docs.success");
    });
};

start();