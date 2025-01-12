import {Worker} from 'worker_threads';

export class WorkerPool {
    constructor(workerFile: string, poolSize: number) {
        this.poolSize = poolSize;
        this.workers = [];
        this.taskQueue = [];
        this.workerQueue = [];

        for (let i = 0; i < poolSize; i++) {
            const worker = new Worker(workerFile);
            worker.on('message', (result) => {
                const {resolve} = this.workerQueue.shift();
                resolve(result);
                this.assignTask(worker);
            });
            worker.on('error', (err) => console.error(err));
            worker.on('exit', (code) => {
                if (code !== 0) console.error(`Worker exited with code ${code}`);
            });
            this.workers.push(worker);
        }
    }

    assignTask(worker) {
        if (this.taskQueue.length > 0) {
            const {task, resolve, reject} = this.taskQueue.shift();
            this.workerQueue.push({resolve, reject});
            worker.postMessage(task);
        }
    }

    runTask(task) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({task, resolve, reject});
            const availableWorker = this.workers.find(
                (worker) => !this.workerQueue.some(({worker: w}) => w === worker)
            );
            if (availableWorker) {
                this.assignTask(availableWorker);
            }
        });
    }
}