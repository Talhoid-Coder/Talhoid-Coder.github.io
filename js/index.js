function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }
    button.appendChild(circle);
    let hasHref = this.hasAttribute('href');
    if (hasHref) {
        let href = this.getAttribute('href');
        let newtab = this.getAttribute('href-newtab');
        if (window.event.ctrlKey) {
            newtab = false;
        }
        buttonhref(href, newtab);
    }
}

window.onload = function() {
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
        button.addEventListener("click", createRipple);
    }
};

function buttonhref(link, newtab = false) {
    if (!newtab) {
        window.open(link);
    }
    else {
        window.location.href = link;
    }
}

swal("Oops!", "Something went wrong on the page!", "error");


function addCard(elem, outercard, inset, pos) {
    let main = elem;
    var html = `
        <div class="wrapper" data-aos="fade-up" data-aos-mirror="true">
            <div class="card" ${pos}><h1>${outercard}</h1><br class="clear" />
                <div class="inset">${inset}<br class="clear" /></div>
            </div>
        </div>
    `;
    main.innerHTML += html;
    VanillaTilt.init(document.querySelectorAll('.card'), {
        max: 12.5,
        speed: 400,
        glare: true,
        "max-glare": 0.7,
        scale: 1.1
    });
}


function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    }
    else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

function disableBodyScroll(settings) {
    if (document.readyState === 'complete') {
        if (document.body.scrollHeight > window.innerHeight) {
            if (settings.savePosition) document.body.style.marginTop = `-${window.pageYOffset}px`;
            document.body.style.position = 'fixed';
            document.body.style.overflowY = 'scroll';
        }
    }
    else {
        window.addEventListener('load', () => disableBodyScroll({
            savePosition
        }));
    }
}

function enableBodyScroll() {
    if (document.readyState === 'complete') {
        document.body.style.position = '';
        document.body.style.overflowY = '';

        if (document.body.style.marginTop) {
            const scrollTop = -parseInt(document.body.style.marginTop, 10);
            document.body.style.marginTop = '';
            window.scrollTo(window.pageXOffset, scrollTop);
        }
    }
    else {
        window.addEventListener('load', enableBodyScroll);
    }
}

var i;
docReady(function(event) {
    if (localStorage.getItem("welcome") === null) {
        localStorage.setItem("welcome", 1);
    }
    const targetElement = document.getElementById("bg");
    var i = 1;
    var delay = 100;
    var cards = 5;
    disableBodyScroll({
        savePosition: true
    });

    function delayLoop(fn, times, delay) {
        setTimeout(function() {
            fn();
            i++;
            if (i < times + 1) {
                delayLoop(fn, times, delay);
            }
        }, delay);
    }
    delayLoop(function() {
        addCard(document.querySelector(".main"), "meow", "meow", i % 2 ? "right" : "left");
        document.getElementById('loaderText').innerHTML = "Adding cards " + i + "/" + cards;
    }, cards, delay);
    AOS.init();
    var loader = document.getElementById("bg");
    var wrapper = document.getElementById("ldw");
    setInterval(function() {
        if (i == cards) {
            setTimeout(function() {
                if (localStorage.getItem("welcome") == 1) {
                    wrapper.innerHTML = "<h1>Welcome to the home of <a href='https://scratch.mit.edu/Talhoid' class='talhoidlink'>Talhoid</a></h1>";
                    localStorage.setItem("welcome", 0);
                }
            }, 500);
            setTimeout(function() {
                loader.setAttribute("style", "opacity:0;");
                setTimeout(function() {
                    loader.remove();
                }, 500);
            }, 2500);
        }

    }, 20);
    enableBodyScroll();
});