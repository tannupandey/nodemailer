
const nodemailer = require('nodemailer')
const {EMAIL, PASSWORD} = require('../env.js')
const Mailgen = require('mailgen')
const signup = async (req, res) =>{
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Successfully Register with us.", // plain text body
        html: "<b>Successfully Register with us.</b>", // html body
      }


    transporter.sendMail(message).then((info) => {
        return res.status(201)
        .json({ 
            msg: "you should receive an email",
            info : info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("Signup Successfully...!");
}


      
    

const getbill = (req,res) => {
    const {userEmail} = req.body;
    
    // res.status(201).json("getbill Successfully...!")
    let config = {
        service:'gmail',
        auth:{
            user:EMAIL, 
            pass:PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config)

    let MailGenerator = new Mailgen({
        theme:"default",
        product:{
            name: "Mailgen",
            link: "https://mailgen.js/"
        }
    })

    let response = {
        body: {
            name: "Daily Practice",
            intro: "Your bill has arrived!",
            table : {
                data:[
                    {item: "Nodemailer Stack Book",
                    description:"A Backend Application",
                    price: "10$"}
                ]
            },
            outro: "Looking forward to do more business"
        }
    }
    let mail = MailGenerator.generate(response)

    let message = {
        from :EMAIL,
        to : userEmail,
        subject :"Place Order",
        html: mail
    }
    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            msg:"you should receive the email now"
        }).catch(error =>{
            return res.status(500).json({error})
        })
    })

}

module.exports={
    signup,
    getbill
}