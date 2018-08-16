var nodemailer = require('nodemailer');
var mailConfig = require('../../config/mail');

//=============================================================
//           initialisation du mailer
//=============================================================

var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        type: "login",
        user: mailConfig.user,
        pass: mailConfig.pass
    }
});




exports.ajoutDomain = (req, res) => {
    var details = req.body;

    if(!details.email) {
        return res.json({error: "un email est requis dans la demande d'ajout d'un domaine"})
    }

    if(!details.nom) {
        return res.json({error: "un email est requis dans la demande d'ajout d'un domaine"})
    }

    var mailContent = "Mr/Mme/Mlle "+details.nom+" souhaiterait ajouter à notre base de données le <b>secteur d'activité</b> "+(details.domain || "<i>non renseigné</i>")+
                      " <br> et la <b>Profession</b> "+(details.subDomain|| "<i>non renseigné</i>")+". <br> <b>email</b>: "+details.email+" <br> <b>Tel</b>: "+(details.tel || ' ')+
                      "<br> <b>Autres suggessions</b>: "+(details.autres || " ")

    var mailOptions = {
        to: "valderane.potong@clinkast.fr" ,
        subject: "Demande d'ajout de secteur et/ou profession",
        html : mailContent
    } 

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
           res.status(500).json({error:"erreur lors de l'envoi du mail"});
        }else{
            console.log("Message sent: " + response.message);
           res.status(201).json({message:"mail bien envoyé"});
        }
   });

}