var birb_url = ""
var birb_icon = document.createElement('canvas');
birb_icon.width = 32;
birb_icon.height = 32;
var birb_ctx = birb_icon.getContext('2d');
var birb_img = new Image();
birb_img.onload = () => {
    birb_ctx.drawImage(birb_img, 0, 0, 32, 32);
    birb_url = birb_icon.toDataURL();
};
birb_img.crossOrigin = "Anonymous"; // because security or smth
birb_img.src = "https://raw.githubusercontent.com/protogenraymond/sus93plus/main/birb.png";

setTimeout(function() {
    setInterval(function() {
        document.querySelectorAll('*[data-exe="trollbox"]').forEach((elem) => {
            elem.setAttribute('data-exe', 'sus93plus');
            elem.setAttribute('data-title', 'SUS93+');
            elem.setAttribute('data-name', 'SUS93.lnk42');
            elem.setAttribute('data-icon', 'sus93_icon');
            elem.querySelector('span').innerText = 'SUS93+';
            elem.querySelector('img').src = birb_url;
        })
    }, 25)
}, 250)

window.addEventListener('message', event => {
    if (typeof event.data === 'object') {
        switch (event.data.use) {
            case "SUS_REPO_DATA":
                event.source.postMessage({ use: "REPO_DATA", repo: localStorage[".sus93/repo_data"], installed: JSON.parse(localStorage[".sus93/apps"]) }, "*")
                break;
            case "SUS_INSTALL":
                $confirm('would you like to install ' + event.data.pkg + '?', (OK) => {
                    if (OK) {
                        setTimeout(function() {
                            event.source.postMessage({ use: "INSTALLING", pkg: event.data.pkg }, "*");
                            $exe('sus93 install ' + event.data.pkg);
                            setTimeout(function() {
                                event.source.postMessage({ use: "NOT_INSTALLING", pkg: event.data.pkg }, "*");
                                if (localStorage['.sus93/' + event.data.pkg] != null) {
                                    $notif('installed package ' + event.data.pkg);
                                    setTimeout(function() {
                                        $explorer.refresh(); // show shortcut on desktop
                                    }, 50);
                                } else {
                                    $notif('failed to install ' + event.data.pkg + ', check devtools');
                                }
                            }, 3500);
                        }, 500);
                    }
                });
                break;
            case "SUS_UNINSTALL":
                $confirm('would you like to uninstall ' + event.data.pkg + '?', (OK) => {
                    if (OK) {
                        $exe('sus93 uninstall ' + event.data.pkg);
                        setTimeout(function() {
                            event.source.postMessage({ use: "REPO_DATA", repo: localStorage[".sus93/repo_data"], installed: JSON.parse(localStorage[".sus93/apps"]) }, "*");
                            setTimeout(function() {
                                $explorer.refresh(); // show shortcut on desktop
                            }, 50);
                        }, 500);
                    }
                });
                break;
            case "SUS_DESTROY":
                $alert('you must reinstall your system to remove sus93+');
                break;
            case "SUS_TERMINAL":
                $exe('hello');
                break;
            case "SUS_RUN":
                $exe(event.data.exe);
                break;
        }
    }
});

var font = localStorage[".sus93plus/font.default"];

$exe('sus93 installed'); // will fix the patch later to reflect this command properly

le._apps.sus93plus = {
    exec: function() {
        $window({
            width: 400,
            height: 500,
            resizable: false,
            title: "sus93+",
            url: 'data:text/html;base64,' + btoa(localStorage[".sus93plus/main.html"].replaceAll('SUS93PLUSFONT', font))
        });
    }
}
