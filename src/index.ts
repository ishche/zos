import * as jserver from "json-server";
import { DatasetsService } from "./DatasetsService";

const server = jserver.create();
const dsService: DatasetsService = new DatasetsService("dataset");
const middlewares = jserver.defaults();
server.use(middlewares);

server.put("/api/v1/datasets/:dsname/content", (req, res) => {
    res.send(req.params.dsname);
    console.log(req);
});

server.get("/api/v1/datasets/username", (req, res) => {
    res.send({ username: "username" });
});

server.get("/api/v1/datasets/*/list", (req, res) => {
    res.send(dsService.list());
});

server.get("/api/v1/datasets/*", (req, res) => {
    res.send(dsService.list());
});

server.get("/api/v1/datasets/*/members", (req, res) => {
    res.send({ items: ["MEMBER1", "MEMBER2", "MEMBER3"] });
});

const router = jserver.router("db.json");
server.use(router);

const port: number = 8443;
server.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log("Zowe data-sets mock api server is running at " + port);
});
