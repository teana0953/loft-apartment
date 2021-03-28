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
}