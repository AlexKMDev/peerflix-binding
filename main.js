var simplePrefs = require('sdk/simple-prefs');
const {Cc, Ci} = require('chrome');
var contextMenu = require('sdk/context-menu');
var { env } = require('sdk/system/environment');

function play(url) {
  if (validScheme(url) == false) {
    console.log("invalid scheme");
    return;
  }

  if (simplePrefs.prefs.nodejs) {
    env.PATH += ':' + simplePrefs.prefs.nodejs
  }

  var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
  file.initWithPath(simplePrefs.prefs.player);

  var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
  process.init(file);

  var params = simplePrefs.prefs.params;
  var args = [url]

  if (params) {
    args.push(...params.split(' '));
  }

  process.runAsync(args, args.length, observer);
}

function observer(subject, topic, data) {
  console.log(subject, topic, data)
}

function validScheme(url) {
  var pattern = /^(ftp|http|https|magnet):.{1,}$/i;
  return pattern.test(url);
}

contextMenu.Item({
  label: 'Watch with Peerflix',
  context: contextMenu.SelectorContext('area[href],a[href]'),
  contentScript: 'self.on("click", function(node, data) {' + 
                 '  self.postMessage(node.href);' +
                 '})',
  accessKey: 'g',
  onMessage: play
});
