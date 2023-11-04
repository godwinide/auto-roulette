const init = () => {

    const dozens = {
        first: {
            selector: "1st12"
        },
        second: {
            selector: "2nd12"
        },
        third: {
            selector: "3rd12"
        }
    }

    const lastTime = new Date();

    const clickDozen = (dozen, targetEl) => targetEl.dispatchEvent(dozen.clickEvent);

    const clickers = {

        click12: () => {
            const targetElement = document.querySelector("iframe").contentDocument.querySelector('[data-bet-spot-id="1st12"]');
            const targetElement2 = document.querySelector("iframe").contentDocument.querySelector('[data-bet-spot-id="2nd12"]');

            setTimeout(() => {
                clickDozen(dozens.first, targetElement);
            }, 500)
            setTimeout(() => {
                clickDozen(dozens.second, targetElement2);
            }, 800)
        },
        click13: () => {
            const targetElement = document.querySelector("iframe").contentDocument.querySelector('[data-bet-spot-id="1st12"]');
            const targetElement3 = document.querySelector("iframe").contentDocument.querySelector('[data-bet-spot-id="3rd12"]');

            setTimeout(() => {
                clickDozen(dozens.first, targetElement);
            }, 500)
            setTimeout(() => {
                clickDozen(dozens.third, targetElement3);
            }, 800)
        },
        click23: () => {
            const targetElement2 = document.querySelector("iframe").contentDocument.querySelector('[data-bet-spot-id="2nd12"]');
            const targetElement3 = document.querySelector("iframe").contentDocument.querySelector('[data-bet-spot-id="3rd12"]');

            setTimeout(() => {
                clickDozen(dozens.second, targetElement2);

            }, 500)
            setTimeout(() => {
                clickDozen(dozens.third, targetElement3);
            }, 800)
        },
    }

    const matchnumbers = (numbers) => {
        const domNumbers = document.querySelector("iframe").contentDocument.querySelectorAll(".single-number--43778 span");
        const _dnumbers = [];
        domNumbers.forEach(n => {
            _dnumbers.push(n.innerText)
        });

        if (String(_dnumbers.slice(0, 4)) === String(numbers)) {
            return true;
        } else {
            return false
        }
    }

    const updatePositions = () => {
        Object.keys(dozens).forEach((key) => {
            const targetElement = document.querySelector("iframe").contentDocument.querySelector(`[data-bet-spot-id="${dozens[key].selector}"]`);

            // Get the target element's position
            const elementRect = targetElement.getBoundingClientRect();

            // Calculate the center of the target element
            const centerX = elementRect.left + elementRect.width / 2;
            const centerY = elementRect.top + elementRect.height / 2;


            // Create a MouseEvent for the click
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: centerX,
                clientY: centerY,
            });

            dozens[key].clickEvent = clickEvent;
        });
    }

    updatePositions();

    const getUpdate = async () => {
        const url = "https://robinroulettelive.site/api/get-entry";
        const data = await fetch(url);
        const res = await data.json();
        const { entry } = res;

        // update positions before clicking
        updatePositions();

        // bet on prompt
        if (entry) {
            console.log(entry);
            if (matchnumbers(entry.numbers)) {
                const clickType = "click" + entry.prompt.join("");
                setTimeout(() => {
                    clickers[clickType]();
                }, 3000)
            }
        } else {
            const date2 = new Date();
            // Calculate the difference in milliseconds
            const differenceInMilliseconds = date2 - lastTime;
            // Convert milliseconds to minutes
            const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

            if (differenceInMinutes > 3) {
                window.location.reload();
            }
        }
        setTimeout(getUpdate, 2000);
    }
    getUpdate();
}


setTimeout(init, 6000);