// grabbing wheel object and entries from input
const wheel = document.getElementById('wheel');
let wheelRadius = wheel.offsetHeight/2
let entries = document.getElementById('input').value.split(/\r?\n|\r|\n/g);

// angles stuff
let currentRotation = 0;
let degreePerEntry = 360/entries.length;
let rotation = 0;

// list of colors
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

//converting to radians
function toRadians (angle) {
    return angle * (Math.PI / 180);
}

// function randomHex() {
//     let r = Math.round(Math.random()*16);
//     let g = Math.round(Math.random()*16);
//     let b = Math.round(Math.random()*16);
//     if (r+g+b > 10) {
//         let color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
//         console.log(color.toUpperCase());
//         return color.toUpperCase();
//     } else {
//         randomHex()
//     }
// }

// submits the entries in the textarea
function submit() {
    entries = document.getElementById('input').value.split(/\r?\n|\r|\n/g).filter(n => n);
    degreePerEntry = 360/entries.length;

    wheelRadius = wheel.offsetHeight/2
    document.getElementById('wheel').innerHTML = '';

    // makes the gradient
    let i = 0;
    let gradient = '';
    for (const entry of entries) {
        gradient += `${colors[i%colors.length]} ${i*degreePerEntry}deg, ${colors[i%colors.length]} ${(i+1)*degreePerEntry}deg, `;
        i++;
    }
    gradient = gradient.slice(0, -2);
    wheel.style.backgroundImage = `conic-gradient(${gradient})`;

    // puts text on the wheel
    let j = 0;
    for (const entry of entries) {
        let div = document.createElement('div');
        div.innerHTML = entry;
        wheel.appendChild(div);

        div.style.position = 'absolute';
        div.style.transformOrigin = 'center';
        div.style.color = 'white';
        div.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';
        div.style.fontSize = `${Math.min(wheelRadius*1.3/entry.length, 28)}px`;

        let textWidth = div.offsetWidth;
        let textHeight = div.offsetHeight;

        let translateX = wheelRadius-textWidth/2;
        let translateY = wheelRadius-textHeight/2;
        let trigX = wheelRadius*Math.sin(toRadians(-(j+0.5)*degreePerEntry+180));
        let trigY = wheelRadius*Math.cos(toRadians(-(j+0.5)*degreePerEntry+180));

        translateX += 0.5*trigX;
        translateY += 0.5*trigY;

        div.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${(j+0.5)*degreePerEntry-90}deg)`;
        j++;
    }
}

let winner = ''

function spin() {
    if (entries.length < 1) {
        window.alert('Geen namen ingevuld.')
        return
    }
    wheel.style.pointerEvents = 'none'
    let animationLength = parseInt(document.getElementById('slider').value)
    rotation = (Math.random()*360)+animationLength*360;

    const wheelSpin = [
        {transform: `rotate(${currentRotation}deg)`},
        {transform: `rotate(${rotation}deg)`}
    ];

    currentRotation = rotation%360;

    const wheelTiming = {
        duration: animationLength*1000,
        iterations: 1,
        easing: 'cubic-bezier(.3,.56,.43,1)',
    };

    wheel.animate(wheelSpin, wheelTiming);
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    winner = entries[Math.floor(((-currentRotation+360)%360)/degreePerEntry)]

    setTimeout(() => {
        startConfetti();
        document.getElementById('popupdiv').style.display = 'flex';
        document.getElementById('popup').innerHTML = `${winner} heeft gewonnen!`;
    }, animationLength*1000+500);
}

function continuee() {
    stopConfetti();
    document.getElementById('input').value = document.getElementById('input').value.replace(winner, '')
    wheel.style.pointerEvents = 'auto';
    document.getElementById('popupdiv').style.display = 'none';
    submit();
}

window.onload = submit();
window.onresize = submit();

const interval = setInterval(function() {
    submit();
    }, 10);