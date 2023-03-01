## ✨ Trigger.dev Welcome Drip Campaign with SendGrid

This repo contains a [customEvent](https://docs.trigger.dev/triggers/custom-events) Trigger that will send an example drip email campaign using [SendGrid](https://sendgrid.com/).

```ts
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
```

## 🔧 Install

You can easily create a new project interactively based on this template by running:

```sh
npx create-trigger@latest sendgrid-welcome-drip-campaign
# or
yarn create trigger sendgrid-welcome-drip-campaign
# or
pnpm create trigger@latest sendgrid-welcome-drip-campaign
```

Follow the instructions in the CLI to get up and running locally in <30s.

## ✍️ Customize

### Customize the drippiness

You can customize the delays between emails by editing the `ctx.waitFor` call:

```ts
await ctx.waitFor("⏲", { hours: 1 });
```

## 📺 Go Live

After you are happy with your campaign and deploy it live to Render.com (or some other hosting service), you can send custom events that Trigger your workflow using the [sendEvent](https://docs.trigger.dev/reference/send-event) function from the `@trigger.dev/sdk`, or simply by making requests to our [`events`](https://docs.trigger.dev/api-reference/events/sendEvent) API endpoint.

Here is an example of sending the custom event to trigger the workflow contained in this repo using `fetch`:

```ts
const eventId = ulid();
const event = {
  name: "new.user",
  payload: {
    id: "user_1234",
    email: "eric@trigger.dev",
    name: "Eric",
  },
};

const response = await fetch("https://app.trigger.dev/api/v1/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TRIGGER_API_KEY}`,
  },
  body: JSON.stringify({
    id: eventId,
    event,
  }),
});
```
