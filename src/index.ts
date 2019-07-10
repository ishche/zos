import * as fs from "fs";
import * as jserver from "json-server";
import * as path from "path";

const server = jserver.create();
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
    const filter = req.params[0];
    res.send(generateDatasets(filter));
});

server.get("/api/v1/datasets/*", (req, res) => {
    const filter = req.params[0];
    res.send(generateDatasets(filter));
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

function generateDatasets(filter: string) {
    const dataFolder = path.join("dataset");
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }

    const datasets = fs.readdirSync(dataFolder);
    const result = [];
    for (const dataset of datasets) {
        if (dataset.endsWith(".json")) {
            continue;
        }
        try {
            const metadata = JSON.parse(fs.readFileSync(path.join(dataFolder, dataset + ".json")).toString());
            if (Object.getOwnPropertyDescriptor(metadata, "name")) {
                // Owerride name of dataset
                result.push({ name: dataset, ...metadata });
            } else {
                result.push(metadata);
            }
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.error(error);
        }
    }
    return { items: result };
}
