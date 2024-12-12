import chalk from "chalk";
import { reactRouterFastify } from "@mcansh/remix-fastify/react-router";
import { fastify } from "fastify";
import cors from "@fastify/cors";
import sourceMapSupport from "source-map-support";
import getPort, { portNumbers } from "get-port";

sourceMapSupport.install();

let app = fastify();

await app.register(
  async function handleCors(childServer) {
    childServer.register(cors, {
      origin: "*",
    });
  },
  { prefix: "/api" },
);

app.all("/api/hello", async (request, reply) => {
  reply.status(200).send({ hello: "world" });
});

await app.register(reactRouterFastify);

const desiredPort = Number(process.env.PORT) || 3000;
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100),
});

let address = await app.listen({ port: portToUse, host: "0.0.0.0" });

if (portToUse !== desiredPort) {
  console.warn(
    chalk.yellow(
      `⚠️ Port ${desiredPort} is not available, using ${portToUse} instead.`,
    ),
  );
}

console.log(chalk.green(`✅ app ready: ${address}`));
