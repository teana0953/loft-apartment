export namespace Utility {
    /**
     *
     * @param ms
     */
    export async function Delay(ms: number): Promise<void> {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                return resolve();
            }, ms);
        });
    }

    /**
     * Round
     */
    export function Round(value: number, remainCount: number): number {
        return Math.round(value * Math.pow(10, remainCount)) / Math.pow(10, remainCount);
    }
}
