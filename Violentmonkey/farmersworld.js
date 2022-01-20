// ==UserScript==
// @name            农民世界自动化
// @description     体力判断、自动工作
// @namespace       zmn
// @match           https://play.farmersworld.io/
// @grant           none
// @version         2022.1.0.2
// @author          Dean.Chou
// @run-at          document-end
// @downloadURL    https://raw.githubusercontent.com/deanchou/scripts/master/Violentmonkey/farmersworld.js
// ==/UserScript==
(async function () {
    'use strict';

    console.log('脚本开始');
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
    let resNumber = document.getElementsByClassName('resource-number');
    if (resNumber.length == 4) {
        let num = parseInt(resNumber[3].firstChild.innerHTML);
        console.log('体力', num);
        if (num < 400) {
            let resEnergy = document.getElementsByClassName('resource-energy--plus');
            if (resEnergy.length > 0) {
                resEnergy[0].click();
                console.log('添加体力');
                let imgButton = document.getElementsByClassName('image-button');
                if (imgButton.length > 0) {
                    for (let i = 0; i < (500 - num) / 5; i++) {
                        imgButton[2].click();
                        await sleep(100);
                    }
                    let plainButton = document.getElementsByClassName('plain-button long');
                    if (plainButton.length > 0) {
                        plainButton[0].click();
                        console.log('点击充体力');
                        await sleep(5000);
                    }
                }
            }
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