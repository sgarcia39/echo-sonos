var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");

// console.log("process.argv.length : " + process.argv.length);
var processArguments = process.argv.slice(2);

var command = "Build.Run";
var platform = "iOS";
var build = 0;

var applicationsPath = "/Applications";
var unityRelativePath = "/Unity.app/Contents/MacOS/Unity";
var directoryPath = __dirname;
var buildLibrariesPath = "Libraries";
var buildLibraryPath;
var projectPath;
var projectLibraryPath;
var buildTarget;
var unityPath;
var unityVersion;

var resolveArguments = function() {
    command = processArguments[0];
    platform = processArguments[1];
    build = processArguments[2];
    branch = processArguments[3];
    unityVersion = processArguments[4];

    buildTarget = platform == "iOS" ? "ios" : "android";
    buildLibrariesPath = directoryPath + "/../../" + buildLibrariesPath;
    buildLibraryPath = buildLibrariesPath + "/" + platform;

    projectPath = path.resolve(directoryPath + "/..");
    projectLibraryPath = projectPath + "/" + "Library";

    unityPath = applicationsPath + "/Unity" + unityVersion + unityRelativePath;

    console.log("buildLibrariesPath : " + buildLibrariesPath);
    console.log("buildLibraryPath : " + buildLibraryPath);
    console.log("projectPath : " + projectPath);
    console.log("projectLibraryPath : " + projectLibraryPath);
    console.log("unityPath : " + unityPath);
}

var resolveLibrary = function() {
    if (!fs.existsSync(buildLibrariesPath))
    {
        fs.mkdirSync(buildLibrariesPath);
    }

    if (!fs.existsSync(buildLibraryPath))
    {
        fs.mkdirSync(buildLibraryPath);
    }

    if (fs.existsSync(projectLibraryPath))
    {
        fs.unlinkSync(projectLibraryPath);
    }

    var relativePath = path.relative(path.dirname(projectLibraryPath), buildLibraryPath);
    fs.symlinkSync(relativePath, projectLibraryPath, "dir");
}

var resolveBuild = function() {
    var execCommandArray = [
        unityPath,
        "-batchmode",
        "-buildTarget",
        buildTarget,
        "-projectPath",
        projectPath,
        "-executeMethod",
        command,
        "-quit",
        platform,
        build,
        branch
    ];

    var execCommand = execCommandArray.join(" ");
    console.log("execCommand : " + execCommand);

    exec(execCommand, function(error, stdout, stderr) {
        console.log("error : " + error);
    });
};

var start = function() {
    resolveArguments();
    resolveLibrary();
    resolveBuild();
}

start();
