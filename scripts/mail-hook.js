/* eslint-disable */
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('SENDGRID_KEY');

const appName = process.argv[2];
const hash = process.argv[3];
const isSuccess = process.argv[4] === 'true';

const msg = {
    to: ['test@epventures.co'],
    from: 'info@tryit.solutions',
    subject: `Deployment Notice: ${appName}`,
    text: `Deployment`,
    html: `
        <div>
            ${isSuccess ?
            `<p style="color:green"><strong>Status: Succeeded </strong></p>` :
            `<p style="color:red"><strong>Status: Failed</strong></p>`
        }
            <p>Deployment Triggered at ${new Date()} for <strong>${hash}</strong></p>
        <div>
    `,
};

sgMail
    .send(msg)
    .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    })
    .catch((error) => {
        console.error(error.response.body);
    });
