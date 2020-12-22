const { google } = require("googleapis");
const tokenModel = require("../models/token");
const OAuth2 = google.auth.OAuth2;

/** Env settings  */
const SCOPES = ["https://mail.google.com/"];

const TOKEN_SERVICE = "google_mail";

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

let tokenData;
let oAuth2Client;

class GmailOAuth {
  async config() {
    const { client_secret, client_id, redirect_uris } = CREDENTIALS;

    oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris[1]);

    /** This function is called when the oAuth2Client gerenerate new credentials */
    oAuth2Client.on("tokens", (newToken) => {
      tokenData = newToken;
      // Store the token in to the database
      tokenModel.updateOrCreateToken(TOKEN_SERVICE, newToken).catch((err) => {
        console.log("Failed to save the token in the database");
        console.log(err);
      });
    });

    tokenData = await tokenModel.getToken(TOKEN_SERVICE);

    if (!tokenData) {
      console.log(`
      Token não encontrado, ou não está na base. Siga as instruções:
        1) Acesse a conta gmail do LAMICO (${process.env.EMAIL_USER})
        2) Acesse o link: 'https://myaccount.google.com/u/2/permissions?pageId=none'
        3) Em 'Apps de terceiros com acesso à conta' remova o acesso desse projeto (web vet).
        4) Autorize o applicativo novamente no link: 
        ${this.getAccessTokenURL()}
      `);
    } else {
      console.log(`achou token`);
      return tokenData;
    }
  }

  /**
   * This function will generate a link to get the new credentials.
   */
  getAccessTokenURL() {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    return authUrl;
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

  async updateToken(tokenFields) {
    return await tokenModel
      .updateOrCreateToken(TOKEN_SERVICE, tokenFields)
      .catch((err) => {
        console.log("Failed to save the token in the database");
        console.log(err);
      });
  }
}

module.exports = GmailOAuth;
