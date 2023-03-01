import { customEvent, Trigger } from "@trigger.dev/sdk";
import * as sendgrid from "@trigger.dev/sendgrid";
import { z } from "zod";

new Trigger({
  id: "sendgrid",
  name: "SendGrid",
  // Trigger on a custom event, see https://docs.trigger.dev/triggers/custom-events
  on: customEvent({
    name: "new.user",
    // Use zod to verify event payload. See https://docs.trigger.dev/guides/zod
    schema: z.object({ id: z.string(), email: z.string(), name: z.string() }),
  }),
  // The run functions gets called once per "new.user" event
  run: async (event, ctx) => {
    // Send the initial welcome email. See https://docs.trigger.dev/integrations/apis/sendgrid/actions/mail-send
    await sendgrid.mailSend("send-welcome-email", {
      from: {
        // Your 'from' email needs to be verified in SendGrid. https://docs.sendgrid.com/for-developers/sending-email/sender-identity
        email: "john@acme.dev",
        name: "John from the Acme Corporation",
      },
      personalizations: [
        {
          to: [
            {
              name: event.name,
              email: event.email,
            },
          ],
        },
      ],
      subject: "Welcome to the Acme Corporation!",
      content: [
        {
          // This can either be text/plain or text/html, text/html in this case
          type: "text/html",
          value: `<p>Hi ${event.name},</p>

<p>Thanks for signing up to the Acme Corporation. </p>

<p>To get started, we recommend browsing our <a href="https://app.acme.dev/templates">templates</a>.</p>

<p>Best,</p>
<p>John</p>
<p>CEO, the Acme Corporation</p>`,
        },
      ],
    });

    // Wait for 1 hour. See https://docs.trigger.dev/functions/delays
    await ctx.waitFor("⏲", { hours: 1 });

    // Send the follow up email
    await sendgrid.mailSend("send-follow-up-email", {
      // Your 'from' email needs to be verified in SendGrid. https://docs.sendgrid.com/for-developers/sending-email/sender-identity
      from: {
        email: "john@acme.dev",
        name: "John Doe",
      },
      personalizations: [
        {
          to: [
            {
              name: event.name,
              email: event.email,
            },
          ],
        },
      ],
      subject: "How are you finding the Acme Corporation?",
      content: [
        {
          // This can either be text/plain or text/html, text/plain in this case
          type: "text/plain",
          value: `Hi ${event.name},

We hope you're enjoying using our product. If you have any questions, please get in touch!

Best,
John,

CEO, the Acme Corporation`,
        },
      ],
    });
  },
}).listen();
