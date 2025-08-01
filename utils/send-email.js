import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

//to is the user, type is the type of reminder, subscription is the full object
export const sendReminderEmail = async ({ to, type, subscription }) => {
    //im guessing that to is the user's email that we want to send to and type is the label that we will be sending
    if(!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((t) => t.label === type); //we find the label if it matches the type

    if(!template) throw new Error('Invalid email type'); //if there is no matching label we throw an error

    const mailInfo = {
        userName: subscription.user.name, // we pass the user's ame
        subscriptionName: subscription.name, // the subs name
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'), // when the date will renew
        planName: subscription.name, // not sure why we call this again
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`, // we format so like usd 10 (weekly)
        paymentMethod: subscription.paymentMethod, // we take what we used to pay
    }

    const message = template.generateBody(mailInfo); //create a body
    const subject = template.generateSubject(mailInfo); //create a subject

    const mailOptions = {
        from: accountEmail, //from the reminder email that sends reminders
        to: to, // to our user
        subject: subject, // the subject
        html: message, // our message body
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) return console.log(error, 'Error sending email');

        console.log('Email sent: ' + info.response)
    })
}