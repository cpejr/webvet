const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: `${process.env.EMAIL_HOST}`,
  port: `${process.env.EMAIL_PORT}`,
  secure: false,
  auth: {
    user: `${process.env.EMAIL_USER}`,
    pass: `${process.env.EMAIL_PASS}`
  },
  tls: {
    rejectUnauthorized: false
  }
});


class Email {

  static sendEmail(data) {
    const config = {
     from: 'moreiramrafaela@gmail.com',
     to: data.clientEmail,
     subject: data.subject,
     text: data.content,
     attachments: data.attachments
   };
   return new Promise((resolve) => {
     transporter.sendMail(config, (error, info) => {
       if (error) {
         console.log(error);
         resolve(error);
       }
       else {
         console.log(`Email enviado ${info.response}`);
         resolve(info);
       }
     });
   });
  }

  static contactEmail(data) {
    const config = {
      from: data.clientEmail,
      to: '',
      subject: data.subject,
      text: `Mensagem enviada por: ${data.name}

      ${data.content}`
    };
    return new Promise((resolve) => {
      transporter.sendMail(config, (error, info) => {
        if (error) {
          resolve(error);
        }
        else {
          console.log(`Email enviado ${info.response}`);
          resolve(info);
        }
      });
    });
  }

  static userWaitingForApproval(data) {
    console.log('Email aguardando aprovação enviado');
    const content = `Prezado(a) ${data.firstName},
    Você acabou de cadastrar na plataforma Lamico. Aguarde a ativação do seu cadastro para começar a utilizar o sistema.`;
    const subject = 'LAMICO: Aguardando ativação de cadastro';
    const emailContent = {
      clientEmail: data.email,
      subject,
      content
    };
    return new Promise((resolve) => {
      Email.sendEmail(emailContent).then((info) => {
        resolve(info);
      });
    });
  }

  static userApprovedEmail(data) {
    console.log('Cadastro de usuário aprovado');
    const content = `Prezado(a) ${data.fullname},
    Seu cadastro foi realizado e aprovado com sucesso. Entre na plataforma com seu email e senha`;
    const subject = 'LAMICO: Cadastro ativado com sucesso';
    const emailContent = {
      clientEmail: data.email,
      subject,
      content
    };
    return new Promise((resolve) => {
      Email.sendEmail(emailContent).then((info) => {
        resolve(info);
      });
    });
  }

  static userRejectedEmail(data) {
    console.log('Cadastro de usuário reprovado');
    const content = `Prezado(a) ${data.firstName},
    Sua solicitação de cadastro foi reprovada e não será possível utilizar a plataforma da Lamico.`;
    const subject = 'LAMICO: Cadastro reprovado';
    const emailContent = {
      clientEmail: data.email,
      subject,
      content
    };
    return new Promise((resolve) => {
      Email.sendEmail(emailContent).then((info) => {
        resolve(info);
      });
    });
  }

}


module.exports = Email;
