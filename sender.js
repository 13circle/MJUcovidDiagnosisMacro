const nodemailer = require('nodemailer');
const mailer = require('./config/mailer');

const getTrasportObj = () => nodemailer.createTransport(mailer.transporter);

const getMailOptions = (stud_id, email, isExpire) => {
	let dateObj = new Date();
	let currDate = (dateObj.getMonth() + 1) + '월 ' + dateObj.getDate() + '일';
	return {
		from: mailer.transporter.auth.user,
		to: email,
		subject: isExpire ? '계정 만료 안내' : `${currDate} 명지대학교 온라인 코로나 진단서`,
		html: isExpire ? (
			'<h3>계정 만료 안내</h3> <br>'
		  + `안녕하십니까, ${stud_id}님. <br>`
		  + `${stud_id}님의 종강일로 설정하신 ${currDate}이 되어 내일 계정이 만료될 예정입니다. <br>`
		  + '<b>아직 종강일이 아니시라면 홈페이지에 로그인하셔서 반드시 오늘 중으로 종강일을 수정하시기 바랍니다. <br>'
		  + '이외에도 다른 문제가 있으시다면 13circle97@gmail.com으로 메일 보내주시면 성실히 답변해드리겠습니다. <br><br>'
		  + '감사합니다.'
		) : (
			`<h3>${currDate}자 온라인 코로나 진단서입니다.</h3> <br>`
		  + `<img src="cid:unique@${stud_id}.png"> <br><br>`
		  + '이미지 파일이나 그 외에 다른 문제가 있으시다면 13circle97@gmail.com으로 메일 보내주시면 성실히 답변해드리겠습니다. <br><br>'
		  + '감사합니다.'
		),
		attachments: isExpire ? null : [
			{
				filename: `${stud_id}.png`,
				path: `${__dirname}/diagnosis/${stud_id}.png`,
				cid: `unique@${stud_id}.png`
			}
		]
	};
};

exports.imgToMail = (stud_id, email) => {

	let transport = getTrasportObj();

	transport.sendMail(getMailOptions(stud_id, email, false), (err, info) => {
		if(err) throw err;
		console.log('Image sent to ' + mailOptions.to);
	});

};

exports.mailExpiration = (stud_id, email) => {

	let transport = getTrasportObj();

	transport.sendMail(getMailOptions(stud_id, email, true), (err, info) => {
		if(err) throw err;
		console.log('Expiration announcement sent to ' + mailOptions.to);
	});

};

