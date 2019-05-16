import * as jserver from "json-server";

const server = jserver.create();
const middlewares = jserver.defaults();
server.use(middlewares);

server.get("/api/v1/datasets/username", (req, res) => {
  res.send({ username: "HELOKITY" });
});

server.get("/api/v1/datasets/*/list", (req, res) => {
  const filter = req.params[0];
  res.send(generateDatasets(filter));
});

server.get("/api/v1/datasets/*/members", (req, res) => {
    const dataSetName = req.params[0];
    res.send({"items": ["MEMBER1", "MEMBER2", "MEMBER3"]});
});

const router = jserver.router("db.json");
server.use(router);

const port: number = 8443;
server.listen(port, () => {
  console.log("Zowe data-sets mock api server is running at " + port);
});

function generateDatasets(filter: string) {
  return {
    items: [
      {
        migrated: false,
        name: filter.split("*").join("A").toLocaleUpperCase()
      }
    ]
  };
}

interface Dataset {
  name: String;
}
