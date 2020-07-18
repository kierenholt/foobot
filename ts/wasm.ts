async function wasmBrowserInstantiate(wasmModuleUrl, importObject?) {
    let response = undefined;

    if (!importObject) {
    importObject = {
        env: {
        abort: () => console.log("Abort!")
        }
    };
    }

    // Fallback to using fetch to download the entire module
    // And then instantiate the module
    const fetchAndInstantiateTask = async () => {
        const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
        response.arrayBuffer()
        );
        return WebAssembly.instantiate(wasmArrayBuffer, importObject);
    };
    response = await fetchAndInstantiateTask();


    return response;
};