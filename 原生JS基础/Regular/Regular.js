
window.onload = function() {
    var doc = document,
        parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/,
        url = "http://www.ora.com:80/goodparts?q#fragment",
        result = parse_url.exec(url),
        names = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"],
        blanks = "        ",
        odiv = doc.getElementById("div1");
        html = "";

    for(var i=0; i < names.length; i++) {
        html += "<p>" + names[i] + ": " + blanks.substring(names[i].length) + result[i] + "</p>";
    }
    odiv.innerHTML=html;
};
