
export function createURI(path: string, baseUri: string) {
    const url = new URL(path,baseUri)
    return url.toString()
}