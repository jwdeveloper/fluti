export class BreakpointController {
    width = $state(0)
    breakpoint = $state('');
    isMobile = $derived.by(() => this.breakpoint === "sm" || this.breakpoint === "md");
    isMedium = $derived.by(() => this.breakpoint === "md");

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
