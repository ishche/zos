import * as fs from "fs";
import * as path from "path";

// tslint:disable-next-line: interface-name
export interface Dataset {
    allocationUnit: string;
    averageBlock: number;
    blockSize: number;
    dataSetOrganization: string;
    deviceType: number;
    directoryBlocks: number;
    name: string;
    primary: number;
    recordFormat: string;
    recordLength: number;
    secondary: number;
    volumeSerial: string;
}

export class DatasetsService {
    constructor(private datasetsPath: string) {
        if (!fs.existsSync(this.datasetsPath)) {
            fs.mkdirSync(this.datasetsPath);
        }
    }

    public listMembers(dsName: string): any {
        const membersPath = path.join(this.datasetsPath, dsName);
        if (!fs.existsSync(membersPath) || !fs.lstatSync(membersPath).isDirectory()) {
            // TODO error?
            return { items: [] };
        }
        const members = fs.readdirSync(membersPath);
        const result = [];
        for (const member of members) {
            result.push(member);
        }
        return { items: result };
    }

    public list(filter: string = "*"): any {
        const result = [];
        for (const ds of this.dsList(filter)) {
            result.push({
                // tslint:disable-next-line: no-string-literal
                migrated: ds["migrated"],
                name: ds.name,
            });
        }
        return { items: result };
    }

    public listFull(filter: string = "*"): any {
        return { items: this.dsList(filter) };
    }

    public delete(dsName: string): boolean {
        const res = this.parseDatasetName(dsName);
        try {
            if (res.member) {
                fs.unlinkSync(path.join(this.datasetsPath, res.dataset, res.member));
                const poDir = path.join(this.datasetsPath, res.dataset);
                if (fs.readdirSync(poDir).length === 0) {
                    fs.rmdirSync(poDir);
                }
            } else {
                fs.unlinkSync(path.join(this.datasetsPath, res.dataset + ".json"));
                fs.unlinkSync(path.join(this.datasetsPath, res.dataset));
            }
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.error(error);
            return false;
        }
    }

    private parseDatasetName(dsName: string): { dataset: string; member?: string } {
        let dataset: string = dsName;
        let member: string | undefined;
        const endOfDatasetName = dsName.indexOf("(");
        if (endOfDatasetName) {
            dataset = dsName.substring(0, endOfDatasetName);
            member = dsName.substring(endOfDatasetName + 1, dsName.length - 1);
        }
        return { dataset, member };
    }

    private dsList(filter: string): Dataset[] {
        const datasets = fs.readdirSync(this.datasetsPath);
        const result = [];
        for (const dataset of datasets) {
            if (dataset.endsWith(".json")) {
                continue;
            }
            if (!this.checkFilter(dataset, filter)) {
                continue;
            }
            try {
                const metadata = JSON.parse(
                    fs.readFileSync(path.join(this.datasetsPath, dataset + ".json")).toString(),
                );
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
        return result;
    }

    private checkFilter(dsName: string, filter: string): boolean {
        if (filter === "*") {
            return true;
        }
        // TODO: implement not only prefix filtering
        if (dsName.startsWith(filter)) {
            return true;
        }
        return false;
    }
}
