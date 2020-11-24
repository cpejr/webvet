const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const tokenModel = require("./token");

let oAuth2Client;
let token;
let transporter;

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

const SERVICE = "google_mail";

const CREDENTIALS = {
  client_id: process.env.EMAIL_CLIENT_ID,
  project_id: process.env.EMAIL_PROJECT_ID,
  auth_uri: process.env.EMAIL_AUTH_URI,
  token_uri: process.env.EMAIL_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.EMAIL_AUTH_PROVIDER,
  client_secret: process.env.EMAIL_CLIENT_SECRET,
  redirect_uris: process.env.EMAIL_REDIRECT_URIS.split(","),
  javascript_origins: process.env.EMAIL_JAVASCRIPT_ORIGINS.split(","),
};

function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  return authUrl;
}

class Email {
  static async config() {
    const { client_secret, client_id, redirect_uris } = CREDENTIALS;

    oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[1]
    );

    oAuth2Client.on("tokens", (newToken) => {
      // Store the token in to the database
      tokenModel
        .updateToken(SERVICE, { ...token, ...newToken })
        .catch((err) => {
          console.log("Failed to save the token in the database");
          console.log(err);
        });
    });

    token = await tokenModel.getToken(SERVICE);

    if (!token) {
      console.log(`
      Token não encontrado, ou não está na base. Siga as instruções:
        1) Acesse a conta gmail do LAMICO
        2) Acesse o link: 'https://myaccount.google.com/u/2/permissions?pageId=none'
        3) Em 'Apps de terceiros com acesso à conta' remova o acesso desse projeto.
        4) Autorize o applicativo novamente no link: 
        ${getAccessToken()}
      `);
    } else {
      console.log(`achou token`);
      console.log(token);
      const credentials = token.token;
      transporter = nodemailer.createTransport({
        host: `${process.env.EMAIL_HOST}`,
        port: 587,
        secure: false, // No SSL
        auth: {
          type: "OAuth2",
          user: `${process.env.EMAIL_USER}`,
          clientId: `${process.env.EMAIL_CLIENT_ID}`,
          clientSecret: `${process.env.EMAIL_CLIENT_SECRET}`,
          refreshToken: credentials.refresh_token,
          accessToken: credentials.access_token,
          expires: credentials.expires,
        },
      });
      transporter.on("token", (token) => {
        // Store the token in to the database
        console.log(token);
        tokenModel
          .updateToken(SERVICE, {
            access_token: token.accessToken,
            expires: token.expires,
          })
          .catch((err) => {
            console.log("Failed to save the token in the database");
            console.log(err);
          });
      });
    }
  }

  static validateCredentials(code, scope) {
    oAuth2Client.getToken(code, (err, newToken) => {
      if (err) {
        console.error(`Error retrieving access token`, err);
        throw new Error(err);
      }
      token = newToken;
      oAuth2Client.setCredentials(newToken);
      return token;
    });
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

  static contactEmail(to, subject, name) {
    // Função Estragada
    const config = {
      from: `${process.env.EMAIL_USER}`,
      to: to,
      subject: subject,
      text: `Mensagem enviada por: ${name}

      ${data.content}`,
    };
    return new Promise((resolve) => {
      transporter.sendMail(config, (error, info) => {
        if (error) {
          resolve(error);
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

  static newUserNotificationEmail(to) {
    // console.log("Email enviado");
    const content = `Prezada Kelly, novo cadastro a ser aprovado na plataforma`;
    const subject = "Novo cadastro";
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

  static userApprovedEmail(to, firstName) {
    // console.log("Cadastro de usuário aprovado");
    const content = `Prezado(a) ${firstName},
    Seu cadastro foi realizado e aprovado com sucesso. Entre na plataforma com seu email e senha`;
    const subject = "LAMICO: Cadastro ativado com sucesso";
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

  static reportEmail(to, firstName, sampleCode) {
    // console.log("Enviando email de laudo...");
    const content = `Prezado(a) ${firstName},
    O laudo referente a amostra ${sampleCode} já está disponível na plataforma.
    www.micotoxinasbrasil.com.br`;
    const subject = "LAMICO: Laudo disponível";
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

  static userRejectedEmail(to, fullname) {
    // console.log("Cadastro de usuário reprovado");
    const content = `Prezado(a) ${fullname},
    Seu cadastro foi reprovado. Entre em contato com o admin para maiores informações.`;
    const subject = "LAMICO: Cadastro reprovado";
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
