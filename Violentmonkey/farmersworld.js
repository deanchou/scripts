// ==UserScript==
// @name            农民世界自动化
// @description     体力判断、自动工作
// @namespace       zmn
// @match           https://play.farmersworld.io/
// @grant           none
// @version         2022.1.0.3
// @author          Dean.Chou
// @run-at          document-end
// @downloadURL     https://raw.githubusercontent.com/deanchou/scripts/master/Violentmonkey/farmersworld.js
// ==/UserScript==

(async function () {
    'use strict';

    console.log('脚本开始');

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
    const currentFish = Math.floor(
        +document.querySelectorAll(".resource-number")[2].innerText
    );
    const [currentEnergy, maxEnergy] = document
        .querySelectorAll(".resource-number")[3]
        .textContent.split("/")
        .map(Number);

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
            await sleep(15000);
        }
    }

    // 修理
    const buttonRepair = document.querySelectorAll(
        ".info-section .plain-button"
    )[1];
    if (buttonRepair) {
        const quality = eval(
            document.querySelector(".card-number").innerText
        );
        if (
            ![...buttonRepair.classList].includes("disabled") &&
            quality < 0.5
        ) {
            buttonRepair.click();
            await sleep(5000);
        }
    }

    // 工作
    let imgTools = document.getElementsByClassName('carousel__img--item');
    for (let i = 0; i < imgTools.length; i++) {
        imgTools[i].click();
        let times = document.getElementsByClassName('card-container--time');
        if (times.length > 0) console.log(times[0].innerHTML);
        let btnWorks = document.getElementsByClassName('plain-button semi-short');
        for (let j = 0; j < btnWorks.length; j++) {
            if (btnWorks[j].innerHTML == 'Mine') {
                btnWorks[j].click();
                console.log('开始生产');
                await sleep(5000);
            }
        }
        await sleep(500);
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