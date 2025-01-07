function extractPreloadData(dom) {
    let scripts = dom.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.textContent.includes('__PRELOAD_DATA')) {
            try {
                let preloadDataMatch = script.textContent.match(/window\.__PRELOAD_DATA\s*=\s*(\{.*\});/);
                if (preloadDataMatch && preloadDataMatch[1]) {
                    let preloadData = JSON.parse(preloadDataMatch[1]);
                    console.log("Extracted Preload Data:", preloadData);
                    return preloadData;
                }
            } catch (e) {
                console.error("Error parsing __PRELOAD_DATA:", e);
            }
        }
    }
    return null;
}