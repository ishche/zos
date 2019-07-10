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

    // TODO filter support
    private dsList(filter: string): Dataset[] {
        const datasets = fs.readdirSync(this.datasetsPath);
        const result = [];
        for (const dataset of datasets) {
            if (dataset.endsWith(".json")) {
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
}
