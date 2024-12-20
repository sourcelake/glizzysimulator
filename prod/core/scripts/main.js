var glizzy = $("#glizzy")
var points = $("#points")


var counter = 0;
var qnumber = 0;
var frenzyActive = false;

const url = "https://api.jsonsilo.com/57dbb126-3065-476b-bd0c-b860abe2a69d";
const headers = {
    "X-SILO-KEY": "IjEXZx7tVrB5Dpw2pCLnm4CZ4YAOWJB3aS6Ff09P3P",
    "Content-Type": "application/json",
};

var config;  // Declare config globally

function getConfigs() {
    return fetch(url, { headers: headers })
        .then(response => response.json())
        .then(result => {
            config = result["glizzysim"];  // Assign the value to the global variable
        });
}

getConfigs().then(() => {
    console.log(config);  // You can access config here after the promise resolves
});

function randint(max) {
    return Math.round( Math.random() * max );

}

function applyRandomRotation(element) {
    // Generate a random angle between 0 and 360 degrees
    const randomDegree = Math.floor(Math.random() * 360);
    
    // Apply the rotation using CSS transform
    element.style.transform = `rotate(${randomDegree}deg)`;
}

function getRandSplash(splashes) {
    return splashes[ randint( splashes.length-1 ) ]
}

function moveGlizzy(x, y, time) {
    glizzy.css({
        "transform":`translate(${x}px,${y}px)`,
        "transition":`transform ${time}ms linear`
    });
}

function createSplash(x, y, text) {
    console.log(config);
    let splash = document.createElement("h2");
    splash.style.position = "absolute"; // Position absolutely
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    splash.style.opacity = 1;
    splash.style.transition = `opacity ${config["splashTimeout"]}ms`;
    splash.innerHTML = text;
    applyRandomRotation(splash);
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.style.opacity = 0;
        setTimeout(() => splash.remove(), config["splashTimeout"]);
    }, 100);
}

async function countdownFrenzy() {
    setTimeout(() =>
    {frenzyActive = false;}, config["glizzy"]["frenzy"]["frenzylength"])
}

async function rainbowFrenzy() {
    let colours = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "violet"
    ]
    for (let i = 0; i < colours.length; i++) {
        $("body").css({
            "background-color": colours[i],
            "transition": `background-color ${config["glizzy"]["frenzy"]["frenzylength"] / (colours.length * 1000)}ms linear`
        });
        await new Promise(resolve => setTimeout(resolve, config["glizzy"]["frenzy"]["frenzylength"] / colours.length));
    }
    
}

document.addEventListener("mousedown", () => {
    counter++; 
    if (frenzyActive) {
        counter++
    }
    points.html("points: "+counter)
    console.log(counter); 
    if (counter % config["glizzy"]["frenzy"]["frenzyFreq"]) {
        if (randint(config["glizzy"]["frenzy"]["frenzyChance"]) == 0) {
            frenzyActive = true;
            countdownFrenzy();
            rainbowFrenzy();
        }
    }
    if (counter % config["splashFrequency"] == 0) {

        qnumber++;
        $("#title").html("Extreme Algebra | Question " + qnumber)
        let splash = getRandSplash(config["splashes"]);
        console.log( splash )
        createSplash( randint(window.innerWidth-config["edgeWidth"]), randint(window.innerHeight-config["edgeHeight"]), splash )
    }
    moveGlizzy(0, -100, config["glizzy"]["glizzyspeed"]);
    setTimeout(() => {
        moveGlizzy(0, 0, config["glizzy"]["glizzyspeed"]);
    }, config["glizzy"]["glizzyspeed"]);
});
