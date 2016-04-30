var publicPath = "http://rawgit.com/boblaublaw/hifihackathon/master/";
var basePath = Script.resolvePath("..");
print("Base path " + basePath);
Resources.overrideUrlPrefix(publicPath, basePath);