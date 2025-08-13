import type {Optional} from "$lib/fluti/utils/optional";
import type {LoggerService} from "$lib/fluti/utils/logger/LoggerService";

export type StepAction = {
    name: string;
    execute: () => Promise<Optional<any>> | Optional<any>;
    errorMessage?: string;
}

export type StepsResult = {
    success: boolean;
    completedSteps: string[];
    data: Record<string, any>
    failedStep?: string;
    errorMessage?: string;
}

export class StepsRunner {
    private steps: StepAction[] = [];
    private isInitialized: boolean = false;
    private result: StepsResult = {
        success: false,
        data: {},
        completedSteps: []
    };

    private logger: LoggerService

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    /**
     * Registers a new initialization step
     * @param step The initialization step to register
     * @returns The StepsRunner instance for chaining
     */
    public addStep(step: StepAction): StepsRunner {
        if (this.isInitialized) {
            throw new Error('Cannot register steps after initialization has started');
        }

        this.steps.push(step);
        return this;
    }

    /**
     * Registers multiple initialization steps at once
     * @param steps Array of initialization steps to register
     * @returns The StepsRunner instance for chaining
     */
    public addSteps(steps: StepAction[]): StepsRunner {
        if (this.isInitialized) {
            throw new Error('Cannot register steps after initialization has started');
        }

        this.steps.push(...steps);
        return this;
    }

    /**
     * Executes all registered initialization steps in sequence
     * @returns Promise resolving to the initialization result
     */
    public async run(): Promise<StepsResult> {
        if (this.isInitialized) {
            return this.result;
        }

        this.isInitialized = true;
        this.result.completedSteps = [];
        try {
            let index = 0;
            for (const step of this.steps) {
                index++;
                this.logger.info(`[${index}. ${step.name}]`)
                const stepResult = await step.execute();
                if (stepResult.isFail()) {

                    this.result.success = false;
                    this.result.failedStep = step.name;
                    this.result.errorMessage = stepResult.getError() || `Step '${step.name}' failed`;
                    return this.result;
                }
                this.result.data[step.name] = stepResult.get();
                this.result.completedSteps.push(step.name);
            }

            this.result.success = true;
            return this.result;
        } catch (error) {
            this.result.success = false;
            this.result.errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during initialization';
            return this.result;
        }
    }

    /**
     * Resets the initializer to allow for re-initialization
     */
    public reset(): void {
        this.isInitialized = false;
        this.result = {
            success: false,
            data: {},
            completedSteps: []
        };
    }

    /**
     * Gets the current initialization status
     * @returns The current initialization result
     */
    public getStatus(): StepsResult {
        return structuredClone(this.result);
    }

    /**
     * Checks if the server has been successfully initialized
     * @returns True if initialization was successful, false otherwise
     */
    public isInitializationSuccessful(): boolean {
        return this.isInitialized && this.result.success;
    }
}