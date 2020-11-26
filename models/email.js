const nodemailer = require("nodemailer");
const tokenModel = require("./token");
const GmailOAuth = require("../utils/GmailOAuth");

/**
 * This function will generate a link to get the new credentials.
 */
function getAccessTokenURL() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  return authUrl;
}

let transporter;
let token;
let TransportConfig;
class Email {
  static async config() {
    const gmailOAuth = new GmailOAuth();
    token = await gmailOAuth.config();

    if (token) {
      const credentials = token.token;

      TransportConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: `${process.env.EMAIL_USER}`,
          clientId: `${process.env.EMAIL_CLIENT_ID}`,
          clientSecret: `${process.env.EMAIL_CLIENT_SECRET}`,
          refreshToken: credentials.refresh_token,
          accessToken: credentials.access_token,
          expires: credentials.expiry_date,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      console.log(TransportConfig);
      transporter = nodemailer.createTransport(TransportConfig);

      transporter.on("token", (token) => {
        // Store the token in to the database
        console.log(token);
        gmailOAuth.updateToken({
          access_token: token.accessToken,
          expiry_date: token.expires,
        });
      });
    }
  }

  static async sendEmail(data) {
    const config = {
      from: `${process.env.EMAIL_USER}`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      attachments: data.attachments,
      auth: { user: `${process.env.EMAIL_USER}` },
    };
    console.log(config);
    return new Promise((resolve, reject) => {
      transporter.sendMail(config, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          // console.log(`Email enviado ${info.response}`);
          resolve(info);
        }
      });
    });
  }

  static userWaitingForApproval(to, firstName) {
    const content = `Prezado(a) ${firstName},
    Você acabou de cadastrar na plataforma Lamico. Aguarde a ativação do seu cadastro para começar a utilizar o sistema.`;
    const subject = "LAMICO: Aguardando ativação de cadastro";
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
    };
    return new Promise((resolve) => {
      Email.sendEmail(emailContent).then((info) => {
        resolve(info);
      });
    });
  }
}

module.exports = Email;
