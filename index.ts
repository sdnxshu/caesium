import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'

import { auth } from '@/lib/auth';

const app = new Hono()

app.use(logger())
app.use(poweredBy())

app.use(
    "/api/auth/*",
    cors({
        origin: "http://localhost:3001",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);

app.get('/', (c) => { return c.text('Hello Hono!') })
app.get('/health', (c) => { return c.text('OK') })
app.get('/metrics', (c) => { return c.text('metrics') })

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default {
    fetch: app.fetch,
    port: 4444,
}
