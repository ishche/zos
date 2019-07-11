// tslint:disable: no-console
import * as jserver from "json-server";
import { DatasetsService } from "./DatasetsService";

const server = jserver.create();
const dsService: DatasetsService = new DatasetsService("dataset");
const middlewares = jserver.defaults();
server.use(middlewares);
server.use(jserver.bodyParser);

/* TOOD leter
POST /api/v1/datasets
Create a data set
*/

/*
GET /api/v1/datasets/{dataSetName}/content
Get the content of a sequential data set, or PDS member
*/
server.get("/api/v1/datasets/:dsname/content", (req, res) => {
    res.send({
        records: dsService
            .contentRead(req.params.dsname)
            .split("\n")
            .join("\\n"),
    });
});

/*
PUT /api/v1/datasets/{dataSetName}/content
Sets the content of a sequential data set, or PDS member
*/
server.put("/api/v1/datasets/:dsname/content", (req, res) => {
    dsService.contentWrite(req.params.dsname, req.body.records);
    res.status(201);
    res.send({});
});

/*
GET /api/v1/datasets/username
Get current userid
*/
server.get("/api/v1/datasets/username", (req, res) => {
    const authHeader: string = req.headers.authorization;
    const creds = new Buffer(authHeader.split(" ")[1], "base64").toString();
    res.send({ username: creds.split(":")[0] });
});

/*
DELETE /api/v1/datasets/{dataSetName}
Delete a data set or member
*/
server.delete("/api/v1/datasets/:dsName", (req, res) => {
    dsService.delete(req.params.dsName);
    res.status(204);
    res.send({});
});

/*
GET /api/v1/datasets/{filter}/list
Get a list of data sets without attributes matching the filter
*/
server.get("/api/v1/datasets/:filter/list", (req, res) => {
    res.send(dsService.list());
});

/*
GET /api/v1/datasets/{filter}
Get a list of data sets matching the filter
*/
server.get("/api/v1/datasets/:filter", (req, res) => {
    res.send(dsService.listFull());
});

/*
GET /api/v1/datasets/{dataSetName}/members
Get a list of members for a partitioned data set
*/
server.get("/api/v1/datasets/:dsname/members", (req, res) => {
    res.send(dsService.listMembers(req.params.dsname));
});

const router = jserver.router("db.json");
server.use(router);

const port: number = 8443;
server.listen(port, () => {
    console.log("Zowe data-sets mock api server is running at " + port);
});
