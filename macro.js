const puppeteer = require('puppeteer');
const sender = require('./sender');
const fs = require('fs');

exports.fillDiagnosis = async (stud_id, pw, email, last_classdate) => {

    let myiwebURL = 'https://myiweb.mju.ac.kr';

    let click = async (page, sel) => {
        await page.waitForSelector(sel);
        await page.click(sel);
    };

    let browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-features=site-per-process',
			'--no-sandbox'
        ]
    });

    let mainPage = await browser.newPage();
    mainPage.on('dialog', dialog => {
        let msg = dialog.message();
        if(msg.indexOf('안내') != -1) {
            dialog.accept();
        }
    });

    await mainPage.goto(myiwebURL, {waitUntil: 'networkidle0'});

    await mainPage.waitForSelector('.itxt');
    await mainPage.type('#userID', stud_id);
    await mainPage.waitFor(200);
    await mainPage.type('#userPW', pw);
    await mainPage.waitFor(2000);
	await mainPage.waitForSelector('input[alt="Login"]');
	await mainPage.click('input[alt="Login"]');

    await mainPage.waitForSelector('frame[name="Body"]');
    let bodyFrame = await (await mainPage.$('frame[name="Body"]')).contentFrame();
    await bodyFrame.waitForSelector('a[target="temp_body2"]');

    let diagnosisPage = await browser.newPage();
    diagnosisPage.on('dialog', dialog => {
        let msg = dialog.message();
        if(msg.indexOf('진단') != -1) {
            dialog.accept();
        }
    });
    await diagnosisPage.goto(
        myiwebURL + '/servlet/MyLocationPage?link=sys/sys13/w_sys143Main.jsp',
        {waitUntil: 'networkidle0'}
    );
    
    await diagnosisPage.waitForSelector('.btn');
    await diagnosisPage.evaluate(() => {
        funcLang('kor');
    });
    await click(diagnosisPage, 'input[name="no1_1"]');
    await diagnosisPage.waitForSelector('input[name="no2_1"]');
    await diagnosisPage.evaluate(() => {
        document.querySelector('input[name="no2_1"]').checked = true;
    });
    await click(diagnosisPage, 'input[name="no3"]');
    await click(diagnosisPage, 'input[name="no4"]');
    await click(diagnosisPage, 'input[name="no5"]');
    await click(diagnosisPage, 'input[name="info_agree"]');
    await diagnosisPage.waitFor(200);
    await diagnosisPage.evaluate(() => {
        funcCheck('dosave');
    });

    await diagnosisPage.waitForSelector('span b');
	if(!fs.existsSync(`${__dirname}/diagnosis`))
		fs.mkdirSync(`${__dirname}/diagnosis`);
    await diagnosisPage.screenshot({
        path: `diagnosis/${stud_id}.png`
    });

	sender.imgToMail(stud_id, email);
	let dateObj = new Date(), tDateObj = new Date(last_classdate);
	if(dateObj.getMonth() == tDateObj.getMonth()
	&& dateObj.getDate() == tDateObj.getDate()) {
		sender.mailExpiration(stud_id, email);
	}

    await browser.close();
};

