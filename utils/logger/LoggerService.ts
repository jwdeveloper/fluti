export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';


export interface LogEvent {
    message: string
    level: string
    timestamp: string
}

export interface LoggerConfig {
    prefix?: string;
    color?: ConsoleColor;
    level?: LogLevel;
    maxHistory?: number;
    includeLocation?: boolean;      // <- add: include caller file:line:col + function
    locationDepth?: number;         // <- add: how many frames to skip (default 2)
    useColors?: boolean

    onLog?: (event: LogEvent) => void
}

export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: any[];
}

const COLORS: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[90m',  // gray
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m', // red
    silent: '',        // no color
};
const RESET = '\x1b[0m';

export type ConsoleColor = keyof typeof ANSI_COLORS;
export const ANSI_COLORS = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    aqua: `\x1b[96m`,

    // Bright colors
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
} as const;

export const ANSI_RESET = '\x1b[0m';

export class LoggerService {
    private level: LogLevel;
    private history: LogEntry[] = [];
    private maxHistory: number;
    private prefix: string;
    private prefixColor: string;
    private includeLocation: boolean;
    private locationDepth: number;
    private useColors: boolean
    private onLog: ((event: LogEvent) => void) | undefined;

    constructor(config?: LoggerConfig) {
        this.prefix = config?.prefix ?? 'Logger';
        this.prefixColor = ANSI_COLORS[config?.color ?? 'white'];
        this.level = config?.level ?? 'info';
        this.maxHistory = config?.maxHistory ?? 500;
        this.includeLocation = config?.includeLocation ?? true;
        this.locationDepth = Math.max(0, config?.locationDepth ?? 2); // skip frames: log() + public method
        this.useColors = config?.useColors ?? true;
        this.onLog = config?.onLog;
    }

    setLevel(level: LogLevel) {
        this.level = level;
    }

    getLevel(): LogLevel {
        return this.level;
    }

    getHistory(): LogEntry[] {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
    }

    /**
     * Returns and clears all logs at once (useful for periodic log uploads)
     */
    fetch(): LogEntry[] {
        const logs = this.getHistory();
        this.clearHistory();
        return logs;
    }

    private shouldLog(targetLevel: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'silent'];
        return levels.indexOf(targetLevel) >= levels.indexOf(this.level);
    }

    formatTime(date: Date): string {
        const pad = (n: number, width = 2) => n.toString().padStart(width, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}:${pad(date.getMilliseconds(), 3)}`;
    }

    private parseStackLine(line: string) {
        // V8 (Chrome/Node): "    at fn (file:line:col)"
        let m = line.match(/^\s*at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)\s*$/);
        if (m) return {fn: m[1], file: m[2], line: Number(m[3]), col: Number(m[4])};

        // V8 no function: "    at file:line:col"
        m = line.match(/^\s*at\s+(.*?):(\d+):(\d+)\s*$/);
        if (m) return {fn: undefined as string | undefined, file: m[1], line: Number(m[2]), col: Number(m[3])};

        // Firefox: "fn@file:line:col"
        m = line.match(/^(.*?)@(.*?):(\d+):(\d+)$/);
        if (m) return {fn: m[1] || undefined, file: m[2], line: Number(m[3]), col: Number(m[4])};

        return null;
    }

    private getCallerLocation(skip = this.locationDepth): string {
        try {
            const err = new Error();
            const raw = (err.stack || '').toString().split('\n');

            // drop the "Error" line and skip internal frames (log(), info(), etc.)
            const frames = raw.slice(1 + skip);

            for (const line of frames) {
                const frame = this.parseStackLine(line);
                if (!frame) continue;

                const file = frame.file || '';
                // skip obvious internals and the logger file itself
                if (
                    file.startsWith('node:internal') ||
                    file.includes('/internal/') ||
                    file.includes('\\internal\\') ||
                    file.includes('LoggerService') // best-effort filter after bundling
                ) {
                    continue;
                }

                // const shortFile = file.replace(/^.*[\\/]/, '');
                const shortFile = file.replace(/^.*[\\/]/, '').split('?')[0];
                return `${shortFile}:${frame.line}:${frame.col}`;

                // const fn = frame.fn ? `${frame.fn}()` : '<anonymous>';
                // return `${fn} ${shortFile}:${frame.line}:${frame.col}`;

            }
        } catch {
            // ignore
        }
        return '';
    }

    private log(level: LogLevel, ...args: any[]) {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            timestamp: new Date(),
            level,
            message: args,
        };

        // this.history.push(entry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        const color = COLORS[level] || '';
        const timestamp = this.formatTime(entry.timestamp);
        const where = this.includeLocation ? this.getCallerLocation() : '';
        const wherePart = where ? ` ${ANSI_COLORS.gray}[${where}]${RESET}` : '';
        const output =
            `${this.prefixColor}[${this.prefix}] ${color}[${level.toUpperCase()}]${RESET} ${ANSI_COLORS.gray}[${timestamp}]${RESET}${wherePart}:`;

        if (this.onLog) {
            this.onLog({
                level: level,
                timestamp: timestamp,
                message: output
            })
        }

        switch (level) {
            case 'debug':
                console.debug(output, ...args);
                break;
            case 'info':
                console.info(output, ...args);
                break;
            case 'warn':
                console.warn(output, ...args);
                break;
            case 'error':
                console.error(output, ...args);
                break;
        }
    }

    debug(...args: any[]) {
        this.log('debug', ...args);
    }

    info(...args: any[]) {
        this.log('info', ...args);
    }

    warn(...args: any[]) {
        this.log('warn', ...args);
    }

    error(...args: any[]) {
        this.log('error', ...args);
    }


}

/*
Usage:

const logger = new LoggerService({
  prefix: 'App',
  color: 'brightCyan',
  level: 'debug',
  includeLocation: true, // <- shows hello() index.ts:42:13 etc.
  locationDepth: 2       // <- adjust if you wrap the logger
});

function hello() {
  logger.info('dasda');
}
hello();

*/
