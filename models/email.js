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
          console.warn(error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  static async userWaitingForApproval(to, firstName) {
    const content = `Prezado(a) ${firstName},
    Você acabou de cadastrar na plataforma Lamico. Aguarde a ativação do seu cadastro para começar a utilizar o sistema.`;
    const subject = "LAMICO: Aguardando ativação de cadastro";
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
    };

    return await Email.sendEmail(emailContent);
  }

  static async newUserNotificationEmail(to) {
    const content = `Prezada Kelly, novo cadastro a ser aprovado na plataforma`;
    const subject = "Novo cadastro";
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
    };

    return await Email.sendEmail(emailContent);
  }

  static async userApprovedEmail(to, firstName) {
    const content = `Prezado(a) ${firstName},
    Seu cadastro foi realizado e aprovado com sucesso. Entre na plataforma com seu email e senha.`;
    const subject = "LAMICO: Cadastro ativado com sucesso";
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
    };

    return await Email.sendEmail(emailContent);
  }

  static async reportEmail(to, firstName, sampleCode) {
    const content = `Prezado(a) ${firstName},
    O laudo referente a amostra ${sampleCode} já está disponível na plataforma.
    www.micotoxinasbrasil.com.br`;
    const subject = "LAMICO: Laudo disponível";
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
    };

    return await Email.sendEmail(emailContent);
  }

  static async requisitionApprovedEmail(to, firstName, requisitionCode) {
    const content = `Prezado(a) ${firstName},
    A sua requisição de código ${requisitionCode} foi aprovada e em breve suas amostras serão analizadas.
    Acompanhe o andamento em www.micotoxinasbrasil.com.br`;
    const subject = "LAMICO: Requisição Aprovada";
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
    };

    return await Email.sendEmail(emailContent);
  }

  static async userRejectedEmail(to, fullname) {
    const content = `Prezado(a) ${fullname},
    Seu cadastro foi reprovado. Entre em contato com o admin para maiores informações.`;
    const subject = "LAMICO: Cadastro reprovado";
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
    };
    return await Email.sendEmail(emailContent);
  }
}

module.exports = Email;
