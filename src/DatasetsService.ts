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

    public list(): any {
        const result = [];
        for (const ds of this.dsList()) {
            result.push({
                // tslint:disable-next-line: no-string-literal
                migrated: ds["migrated"],
                name: ds.name,
            });
        }
        return { items: result };
    }

    public listFull(): any {
        return { items: this.dsList() };
    }

    private dsList(): Dataset[] {
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
