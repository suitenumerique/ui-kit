/**
 * jsdom does not implement the Blob/File read methods (text, arrayBuffer)
 * that the share-import parser relies on, but it does implement FileReader.
 * Back-fill the promise-based methods from it.
 */
const readBlob = <T extends string | ArrayBuffer>(
  blob: Blob,
  method: "readAsText" | "readAsArrayBuffer",
): Promise<T> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as T);
    reader.onerror = () => reject(reader.error);
    reader[method](blob);
  });

if (typeof Blob !== "undefined" && !Blob.prototype.text) {
  Blob.prototype.text = function text() {
    return readBlob<string>(this, "readAsText");
  };
  Blob.prototype.arrayBuffer = function arrayBuffer() {
    return readBlob<ArrayBuffer>(this, "readAsArrayBuffer");
  };
}

export {};
