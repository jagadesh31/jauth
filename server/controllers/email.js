// const nodemailer = require('nodemailer');
// const hbs = require('nodemailer-express-handlebars').default;

// const createLink = async (req, res) => {
//     let { email, purpose } = req.query;
//     let code = randomCode();
    
//     try {
//         let user = await userModel.findOne({ email: email });
//         if (user) {
//             return res.status(400).json({ message: 'Email Already Registered' });
//         }

//         let result = await verificationLinkModel.create({
//             email: email,
//             purpose: purpose,
//             code: code,
//             expiresAt: new Date(Date.now() + 120 * 60 * 1000)
//         });
        
//         // sendMail(email, code);
//         return res.status(200).json({ message: 'Send Successfully' });
//     } catch (err) {
//         console.log('error :', err);
//         return res.status(500).json({ message: 'Server Error' });
//     }
// };

// const verifyLink = async (req, res) => {
//     let { code } = req.query;
//     console.log(code);
    
//     try {
//         let result = await verificationLinkModel.findOne({ code: code });
//         if (!result) {
//             return res.status(404).json({ message: 'Invalid verification link' });
//         }

//         if (result.expiresAt < new Date()) {
//             return res.status(404).json({ message: 'Link got Expired' });
//         }

//         console.log(result);
//         if (result.purpose === 'register') {
//             res.redirect(`http://localhost:5173/redirect?token=${code}&purpose=${result.purpose}&email=${result.email}`);
//         }
//     } catch (err) {
//         console.log('error :', err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


// const transporter = nodemailer.createTransporter({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER || 'gamerdevil033@gmail.com',
//         pass: process.env.EMAIL_PASS || 'acuq kycu iyhe xiyc'
//     }
// });

// const sendMail = (email, code) => {
//     transporter.use('compile', hbs({
//         viewEngine: {
//             extname: '.hbs',
//             partialsDir: path.resolve(__dirname, '../templates'),
//             defaultLayout: false
//         },
//         viewPath: path.resolve(__dirname, '../templates'),
//         extName: '.hbs'
//     }));

//     let options = {
//         from: process.env.EMAIL_USER || 'gamerdevil033@gmail.com',
//         to: email,
//         subject: 'Verification Link',
//         template: 'verificationLink',
//         context: {
//             link: `http://localhost:5000/user/verifyLink/callback?code=${code}`
//         }
//     };

//     transporter.sendMail(options, (err, info) => {
//         if (err) { 
//             console.log('Email error:', err);
//             return;
//         }
//         console.log('Email sent:', info.response);
//     });
// };