import * as fs from "fs";
import * as path from "path";

export class DatasetsService {
    constructor(private datasetsPath: string) {
    }

    public list(): any {
        const dataFolder = this.datasetsPath;
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
}
