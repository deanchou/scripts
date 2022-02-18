// ==UserScript==
// @name            农民世界自动化
// @description     体力判断、自动工作
// @namespace       zmn
// @match           https://play.farmersworld.io/
// @grant           none
// @version         2022.1.0.9
// @author          Dean.Chou
// @run-at          document-end
// @downloadURL     https://raw.githubusercontent.com/deanchou/scripts/master/Violentmonkey/farmersworld.js
// ==/UserScript==
const sH = 6;   // 电锯不生产开始时间
const eH = 18;  // 电锯不生产结束时间

(async function () {
    'use strict';

    console.log('脚本开始');

    setInterval(() => {
        location.reload();
    }, 3600000);

    setInterval(() => {
        const buttonClosePopup = document.querySelector(
            ".modal .plain-button.short"
        );

        if (buttonClosePopup) buttonClosePopup.click();
    }, 2000);

    setInterval(() => {
        const buttonCloseCPUPopup = document.querySelector(
            ".modal-stake .modal-stake-close img"
        );

        if (buttonCloseCPUPopup) buttonCloseCPUPopup.click();
    }, 2000);

    start(1000);

})();

async function autoRobot() {
    console.log('检查')
    try {
        // 登录
        let btnLogin = document.getElementsByClassName('login-button');
        if (btnLogin.length > 0) {
            btnLogin[0].click();
            console.log('点击登录');
            await sleep(5000);
            clickWallet();
            start(15000);
            return;
        }

        // 检查体力
        const resourceNumber = document.querySelectorAll(".resource-number");
        if (resourceNumber.length > 3) {
            const currentFish = Math.floor(resourceNumber[2].innerText);
            const [currentEnergy, maxEnergy] = resourceNumber[3]
                .textContent.split("/")
                .map(Number);

            console.log("体力", currentEnergy, maxEnergy, currentFish);
            if (maxEnergy - currentEnergy > 100 && currentFish > 1) {
                const countEnergyClicks = Math.min(
                    currentFish,
                    Math.floor((maxEnergy - currentEnergy) / 5)
                );

                if (countEnergyClicks > 0) {
                    document.querySelector(".resource-energy img").click();
                    await sleep(2000);

                    for (let i = 0; i++ < countEnergyClicks;) {
                        document
                            .querySelector(".image-button[alt='Plus Icon']")
                            .click();
                        await sleep(200);
                    }
                    document.querySelector(".modal-wrapper .plain-button").click();
                    await sleep(5000);
                }
            }
        }

        // 工作
        let imgTools = document.getElementsByClassName('carousel__img--item');
        for (let i = 0; i < imgTools.length; i++) {
            imgTools[i].click();
            await sleep(500);

            // 修理
            const buttonRepair = document.querySelectorAll(
                ".info-section .plain-button"
            )[1];
            if (buttonRepair) {
                const quality = eval(
                    document.querySelector(".card-number").innerText
                );
                console.log('耐久', quality);
                if (
                    ![...buttonRepair.classList].includes("disabled") &&
                    quality < 0.5
                ) {
                    buttonRepair.click();
                    console.log('修理');
                    await sleep(5000);
                }
            }

            let times = document.getElementsByClassName('card-container--time');
            if (times.length > 0) console.log(times[0].innerHTML);
            let btnWorks = document.getElementsByClassName('plain-button semi-short');
            let titles = document.getElementsByClassName('info-title-name');
            for (let j = 0; j < btnWorks.length; j++) {
                // 是否电锯
                if (titles[0].innerHTML == 'Chainsaw' && sH > 0 && eH > 0) {
                    let h = new Date().getHours();
                    // 是否满足电锯生产时间
                    if (h >= sH && h <= eH)
                        continue;
                }
                if (btnWorks[j].innerHTML == 'Mine' || btnWorks[j].innerHTML == 'Claim') {
                    btnWorks[j].click();
                    console.log('开始生产');
                    await sleep(5000);
                }
            }
            await sleep(500);
        }
    } catch (e) {
        console.log(e);
    }
    start(1000);
}

function clickWallet() {
    let imgWallets = document.getElementsByClassName('login-button--img');
    if (imgWallets.length > 0) {
        imgWallets[0].click();
        console.log('选择钱包');
    }
}

function start(millisec) {
    setTimeout(autoRobot, millisec);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}