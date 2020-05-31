export function eventLogger<T extends any>(emitter: T, emitterName: string, eventName: string | string[]) {
    if (Array.isArray(eventName))
        eventName.forEach(name => eventLogger(emitter, emitterName, name));
    else
        emitter.addEventListener(eventName, event => {
            console.log(`[eventLogger] Emitter: "${emitterName}", event "${eventName}":`, event);
        });
}
