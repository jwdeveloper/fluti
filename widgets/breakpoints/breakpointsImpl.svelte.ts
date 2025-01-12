export class BreakpointController {
    breakpoint = $state('');
    isMobile = $derived.by(() => this.breakpoint === "sm");

    constructor(value: any) {
        this.breakpoint = value;
    }
}

export let breakpoints: BreakpointController;

export let useBreakpoints: () => BreakpointController = (any?: string) => {
    if (!breakpoints) {
        breakpoints = new BreakpointController(any ?? '');
    }
    return breakpoints;
};
