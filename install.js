// sus93+ installer
// written by raymond
// yes i know this is messy but it takes a lot of code to make a nice looking installer

// stop boot sound
setInterval(function() {
    le._sound.boot._src = "";
}, 1);

// cover up windows 93 with container until installer is ready
var plus_container = null;
var progress = null;
var install_container = document.createElement('div');
install_container.classList.add('installer_container');
document.body.appendChild(install_container);

var install_style = document.createElement('style');
install_style.innerHTML = `
.installer_container {
    background: black;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
}
.installer_text_container {
    position: absolute;
    top: 50%;
    left: 50%;
    transition: transform 0.25s;
    color: white;
    padding: 15px;
    font-size: 12px;
    text-align: center;
}
.installer_progress_container {
    width: 350px;
    height: 35px;
    background: #3f3f3f;
    padding: 5px;
}
.installer_progress_text {
    color: white;
    font-size: 16px;
    text-align: center;
    width: 350px;
}
.installer_progress {
    width: 0;
    height: 25px;
    background: rgb(195,255,0);
    transition: width 0.25s;
}
.birb {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.25s;
}
a {
    color: white;
    text-decoration: none;
}`;
document.body.appendChild(install_style);

// birb icon
var birb_data = {};
var birb_icon = document.createElement('canvas');
birb_icon.width = 128;
birb_icon.height = 128;
birb_icon.classList.add('birb');
var birb_ctx = birb_icon.getContext('2d');
var birb_img = new Image();
birb_img.onload = () => {
    setTimeout(function() {
        init_installer();
    }, 500)
};
birb_img.crossOrigin = "Anonymous"; // because security or smth
birb_img.src = "https://raw.githubusercontent.com/protogenraymond/sus93plus/main/birb.png";

// initialize installer
function init_installer() {
    // draw fancy birb
    birb_ctx.drawImage(birb_img, 0, 0, 64, 64);
    birb_data = birb_ctx.getImageData(0, 0, 64, 64).data;
    birb_ctx.clearRect(0, 0, 64, 64);
    var color = 0;
    for (let i = 0; i < 64; i++) {
        setTimeout(function() {
            for (let g = 0; g < 64; g++) {
                birb_ctx.fillStyle = `rgb(${birb_data[color] - 15},${birb_data[color + 1] - 15},${birb_data[color + 2] - 15})`;
                birb_ctx.fillRect(g * 2, i * 2, 1, 1);
                color += 4;
            }
        }, (i - 1) * 25)
    };
    install_container.appendChild(birb_icon);

    plus_container = document.createElement('div');
    plus_container.style.transform = "translate(-50%, -50%) scale(25%)";
    plus_container.style.display = "none";
    if (le.sus93plus != null) {
        plus_container.innerHTML = `
    <h1>sus93+ installer</h1>
    
    sorry, sus93+ is already installed.</br>
    <a href='javascript:plus.reboot()'>[BOOT INTO W93]</a>?`
    } else {
        plus_container.innerHTML = `
    <h1>sus93+ installer</h1>

    sus93+ is a light-weight package manager (using sus93's repo).</br>
    this is purely intended to make sus93 feel cleaner, and easier to use!<p>
    
    sus93+ uses a modified version of sus93 in order to install and use packages.</br>
    know that this still allows you to use sus93 as a cli. this just adds more to it.</br>
    updating sus93 will cause sus93+ to break, as it requires patches to be functional!<p>

    <a href='javascript:plus.install()'>[INSTALL SUS93+]</a></br>
    <a href='javascript:plus.ignore()'>[NEVERMIND]</a>
    `;
    }
    plus_container.classList.add('installer_text_container');
    install_container.appendChild(plus_container);

    setTimeout(function() {
        birb_icon.style.opacity = 0.5;
        plus_container.style.display = "block";
        setTimeout(function() {
            plus_container.style.transform = "translate(-50%, -50%) scale(100%)";
        }, 25)
    }, 500 + 64 * 25);
}

async function installpart(part, progress, progress_text) {
    const settings = { method: "GET", mode: "cors", cache: "reload" };
    progress.style = "";
    switch (part) {
        case "sus93":
            progress_text.innerText = 'installing sus93';
            localStorage["boot/sus93.js"] = await fetch("https://raw.githubusercontent.com/parabirb/sus93/main/bootscript.js", settings).then(response => response.text());
            progress.style = "width: " + (350 / 3) * 1 + "px;";
            localStorage[".sus93/apps"] = JSON.stringify(["sus93"]);
            progress.style = "width: " + (350 / 3) * 2 + "px;";
            localStorage[".sus93/sus93"] = await fetch("https://raw.githubusercontent.com/parabirb/sus93/main/sus93.js", settings).then(response => response.text());
            progress.style = "width: " + (350 / 3) * 3 + "px;";
            setTimeout(function() {
                installpart('sus93-patch', progress, progress_text);
            }, 350)
            break;
        case "sus93-patch":
            progress_text.innerText = 'patching sus93';
            if (!localStorage[".sus93/pluspatched"]) {
                localStorage[".sus93/pluspatched"] = "yes";
                // patch to allow sus93+ to recieve the app list
                localStorage[".sus93/sus93"] = localStorage[".sus93/sus93"].replaceAll(`(argv[0] === "installed")`, `(argv[0] === "installed") { localStorage[".sus93/repo_data"] = Object.keys(repo.packages).join(' ');`).replaceAll('${apps.join("\\n")}`);', '${apps.join("\\n")}`)};').replaceAll('else $log(help);', '').replaceAll('5000', '150');
                // super easy patch to fix issue with terminal appearing when we don't want it to (shouldn't need the patch but whatever :/)
                localStorage["boot/sus93.js"] = localStorage["boot/sus93.js"].replaceAll('true', 'false');
                localStorage["boot/sus93.js"] = localStorage["boot/sus93.js"].replaceAll('5000', '150');
            }
            progress.style = "width: 350px";
            setTimeout(function() {
                installpart('font', progress, progress_text);
            }, 350)
            break;
        case "font":
            progress_text.innerText = 'downloading font';
            progress.style = "width: " + (350 / 3) * 1 + "px;";
            fetch('/c/sys/fonts/px_sans_nouveaux/px_sans_nouveaux.ttf')
                .then(response => response.blob())
                .then(blob => {
                    progress.style = "width: " + (350 / 3) * 2 + "px;";
                    const reader = new FileReader;
                    reader.onerror = $alert.error;
                    reader.onload = () => {
                        localStorage[".sus93plus/font.default"] = reader.result;
                        progress.style = "width: " + (350 / 3) * 3 + "px;";
                        setTimeout(function() {
                            installpart('sus93plus', progress, progress_text);
                        }, 350)
                    };
                    reader.readAsDataURL(blob);
                });
            break;
        case "sus93plus":
            progress_text.innerText = 'installing sus93+';
            localStorage[".sus93plus/main.html"] = await fetch("https://raw.githubusercontent.com/protogenraymond/sus93plus/main/main.html", settings).then(response => response.text());
            progress.style = "width: " + (350 / 2) * 1 + "px;";
            localStorage["boot/sus93plus.js"] = await fetch("https://raw.githubusercontent.com/protogenraymond/sus93plus/main/boot.js", settings).then(response => response.text());
            progress.style = "width: 350px";
            setTimeout(function() {
                plus_container.innerHTML = `
                <h1>sus93+ installer</h1>
                installation is finished!<p>
                <a href='javascript:plus.reboot()'>[BOOT INTO W93]</a>?`
            }, 750)
            break;
    }
}
const plus = {
    ignore: function() {
        plus_container.style.transform = "translate(-50%, -50%) scale(75%)";
        setTimeout(function() {
            plus_container.innerHTML = `
            <h1>sus93+ installer</h1>
            uhh..<p>
            well thank you for checking out sus93+ i guess</br>
            have a good day, bye</br>
            <a href='javascript:plus.reboot()'>[BOOT INTO W93]</a>?`;
            plus_container.style.transform = "translate(-50%, -50%) scale(100%)";
        }, 150)
    },
    reboot: function() {
        location.hash = "#";
        location.reload();
    },
    install: function() {
        plus_container.style.transform = "translate(-50%, -50%) scale(75%)";
        setTimeout(function() {
            plus_container.innerHTML = `
        <h1>sus93+ installer</h1>
        installing sus93+</br>
        this will take a moment.`;
            var progress_container = document.createElement('div');
            progress_container.classList.add('installer_progress_container');
            plus_container.appendChild(progress_container)

            progress = document.createElement('div');
            progress.classList.add('installer_progress');
            progress_container.appendChild(progress);

            progress_text = document.createElement('div');
            progress_text.classList.add('installer_progress_text');
            plus_container.appendChild(progress_text);

            if (!localStorage["boot/sus93.js"]) {
                installpart('sus93', progress, progress_text);
            } else {
                installpart('sus93-patch', progress, progress_text);
            }
            plus_container.style.transform = "translate(-50%, -50%) scale(100%)";
        }, 150)
    }
}
