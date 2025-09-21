import { z } from "zod";
import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .get(
    "/users/:id",
    ({ params }) => {
      const userId = params.id;

      return { id: userId, name: "Julius Caezar" };
    },
    {
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
