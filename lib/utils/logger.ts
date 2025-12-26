type LogLevel = "log" | "info" | "warn" | "error"

const isDevelopment = process.env.NODE_ENV === "development"

class Logger {
    private log(level: LogLevel, message: string, ...args: any[]) {
        // In production, only log warnings and errors
        if (!isDevelopment && (level === "log" || level === "info")) {
            return
        }

        const timestamp = new Date().toISOString()
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`

        console[level](`${prefix} ${message}`, ...args)
    }

    info(message: string, ...args: any[]) {
        this.log("info", message, ...args)
    }

    warn(message: string, ...args: any[]) {
        this.log("warn", message, ...args)
    }

    error(message: string, ...args: any[]) {
        this.log("error", message, ...args)
    }

    debug(message: string, ...args: any[]) {
        if (isDevelopment) {
            this.log("log", message, ...args)
        }
    }
}

export const logger = new Logger()
