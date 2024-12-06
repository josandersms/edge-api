import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { json } from 'milliparsec';
import { environment } from '~app/environment';
import { ipv4 } from '~app/common/helpers';
import { asyncForEach, elementsAtPath, ElementAtPath } from '~app/common/utility';

export class RestService {
    private server!: App;
    public ready: Promise<void>;
   
    public constructor() {
        this.ready = new Promise(async (resolve, reject) => {
            try {
                this.server = new App().use(json()).use(cors({
                    origin: '*'
                }));
                this.server.options('*', cors())
                await this.mountRoutes();
                await this.startServer();
                resolve();
            } catch (error) {
                reject(error as Error);
            }
        });

    }

    private async mountRoutes(): Promise<void> {
        return  new Promise(async (resolve, reject) => {
            try {
                const availableRoutes = await elementsAtPath(`${__dirname}/routes`, /(\.route\.ts)/);
                await asyncForEach(availableRoutes, async (availableRoute: ElementAtPath) => {
                    try {
                        const importedRoute = await import(availableRoute.path); 
                        const route = new importedRoute[Object.keys(importedRoute)[0]]();
                        route.applyRoutes(this.server);
                    } catch (error) {
                        console.log(error);
                        console.log(`Could not load route from ${JSON.stringify(availableRoute)}, skipping...`);
                    }
                });
                resolve();
            } catch (error) {
                reject(error as Error);
            }
        });
    }

    private async startServer(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const port: number = environment.httpServer.port || 8080;
                this.server.listen(port, async () => {
                    console.log(`HTTP Server started on ${await ipv4()}:${port}`);
                });
                resolve();
            } catch (error) {
                reject(error as Error);
            }
        });
    }
}