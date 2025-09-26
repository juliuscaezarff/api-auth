import { z } from "zod";
import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(betterAuthPlugin)
  .get("/", () => "Hello Elysia")
  .get(
    "/users/:id",
    ({ params, user }) => {
      const userId = params.id;

      const authenticateUserName = user.name;

      console.log({ authenticateUserName });

      return { id: userId, name: "Julius Caezar" };
    },
    {
      auth: true,
      detail: {
        summary: "Get user by ID",
        description: "Retrieve a user by their unique ID",
        tags: ["Users"],
      },
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
        }),
      },
    }
  )
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
