import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1] //not sure what this exactly does

//context is an object that upstash provides. It allows us to do a collection of things
export const sendReminders = serve(async (context) => {
    //we got the payload from the subscription controller trigger that returned our workflowId
    //within that body we passed the subscription's id that mongo generated.
    const { subscriptionId } = context.requestPayload; // here we create the subscription Id
    const subscription = await fetchSubscription(context, subscriptionId); // using the id, we can find the subscription details?

    if(!subscription || subscription.status !== 'active') return; // if we did not fine the subscription or if the status is not active we return

    const renewalDate = dayjs(subscription.renewalDate); //dayjs allows us to manipulate this date with various functions

    if(renewalDate.isBefore(dayjs())) { // if the renewal date has already passed we stop it. A dayjs() returns the current time and day.
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    //we iterate through the array with the daysBefore variable.
    for (const daysBefore of REMINDERS) {
        //this takes the renewal date and gets the daysBefore subtracted from it.  Calcultes when the exact date reminder should be sent
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // gets the current day and time and checks if the calculated reminder date is after it
        // so if the reminder is in the future, it knows to sleep and wake up until then.
        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        //this checks if the current date is the same day as the reminderdate. this ignores time like hour and min
        //we do this when it just woke up of if the workflow started on the day before it being due.
        if (dayjs().isSame(reminderDate, 'day')) { // same for this one.
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});

//this is a helper function that uses the sub id that we got from the payload to look in our sub collection
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        // so here we find the subscription details by the id and populate the details  of the name and the email from the user collection
        // we add a user object with the details requested into our subscription object.
        // so, we find the subscription details, grab all of them but as created an object only getting the user's name and email and add that object as well.
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

//this will tell upstash to pause this execution until the correct date. When the date happens, upstash will resume the execution
const sleepUntilReminder = async (context, label, date) => { //not sure what this does
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    //context.run wraps any operation that involves side effects. Label is just the predefined label we created found in isafter or issame
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}