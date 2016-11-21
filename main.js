var simple_prefs = require("sdk/simple-prefs");
const {Cc, Ci} = require("chrome");
var contextMenu = require("sdk/context-menu");

function play(url) {
  var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
  file.initWithPath(simple_prefs.prefs.player);

  var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
  process.init(file);

  var params = simple_prefs.prefs.params;
  var args = [url]

  if (params) {
    args.push(...params.split(' '));
  }

  process.runAsync(args, args.length);
}

var menuItem = contextMenu.Item({
  label: "Watch with Peerflix",
  context: contextMenu.SelectorContext("[href]"),
  contentScript: 'self.on("click", function(node, data) {' + 
                 '  self.postMessage(node.href);' +
                 '})',
  accessKey: "e",
  onMessage: play
});
