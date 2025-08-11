export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LoggerConfig {
    prefix?: string
    color?: ConsoleColor,
    level?: LogLevel
    maxHistory?: 500
}

export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: any[];
}

const COLORS: Record<LogLevel, string> = {
    debug: '\x1b[36m', // gray
    info: '\x1b[90m',  // cyan
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
    gray: '\x1b[90m',   // gray
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',    // aqua
    brightWhite: '\x1b[97m',
} as const;

export const ANSI_RESET = '\x1b[0m';

export class LoggerService {
    private level: LogLevel;
    private history: LogEntry[] = [];
    private maxHistory: number;
    private prefix: string
    private prefixColor: string

    constructor(config?: LoggerConfig) {
        this.prefix = config?.prefix ?? 'Logger';
        this.prefixColor = ANSI_COLORS[config?.color ?? 'white'];
        this.level = config?.level ?? 'info';
        this.maxHistory = config?.maxHistory ?? 500;

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

    private log(level: LogLevel, ...args: any[]) {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            timestamp: new Date(),
            level,
            message: args,
        };

        this.history.push(entry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Emit log event (optional)
        // this.emit('log', entry);

        // Console output
        const color = COLORS[level] || '';
        const timestamp = this.formatTime(entry.timestamp);
        const output = `${this.prefixColor}[${this.prefix}] ${color}[${level.toUpperCase()}]${RESET} ${ANSI_COLORS['gray']}[${timestamp}]:${RESET}`;

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