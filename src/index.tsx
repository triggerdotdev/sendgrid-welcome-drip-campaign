import { customEvent, Trigger } from "@trigger.dev/sdk";
import * as sendgrid from "@trigger.dev/sendgrid";
import { z } from "zod";

new Trigger({
  id: "sendgrid",
  name: "SendGrid",
  // Trigger on a custom event, see https://docs.trigger.dev/triggers/custom-events
  on: customEvent({
    name: "new.user",
    schema: z.object({}),
  }),

  run: async (event, ctx) => {
    // Send the initial welcome email. See https://docs.trigger.dev/integrations/apis/sendgrid/actions/mail-send
    await sendgrid.mailSend("send-welcome-email", {
      from: {
        email: "hello@trigger.dev",
        name: "Matt from Trigger.dev",
      },
      personalizations: [
        {
          to: [
            {
              email: "user@email.com",
            },
          ],
        },
      ],
      subject: "Welcome to Trigger.dev",
      content: [
        {
          // This can either be text/plain or text/html, text/html in this case
          type: "text/html",
          value: `<p>Hi there,</p>

<p>Thanks for signing up to Trigger.dev. </p>

<p>To get started, we recommend browsing our <a href="https://app.trigger.dev/templates">templates</a>.</p>

<p>Best,</p>
<p>Matt</p>
<p>CEO, Trigger.dev</p>`,
        },
      ],
    });

    // Wait for 1 hour. See https://docs.trigger.dev/functions/delays
    await ctx.waitFor("⏲", { hours: 1 });

    // Send the follow up email
    await sendgrid.mailSend("send-follow-up-email", {
      from: {
        email: "hello@trigger.dev",
        name: "Matt Aitken",
      },
      personalizations: [
        {
          to: [
            {
              email: "user@email.com",
            },
          ],
        },
      ],
      subject: "Follow up email",
      content: [
        {
          // This can either be text/plain or text/html, text/plain in this case
          type: "text/plain",
          value: `Hi there,

We hope you're enjoying Trigger.dev. If you have any questions, please get in touch!

Best,
Matt,

CEO, Trigger.dev`,
        },
      ],
    });
  },
}).listen();
