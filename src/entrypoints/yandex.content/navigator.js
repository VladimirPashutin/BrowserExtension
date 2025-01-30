const selectMenuBox = () => {
    const menuBox = document.
          getElementsByClassName('sc-sidebar-ya-business-sidebar__box')
    if(!menuBox || menuBox.length !== 1) {
        console.error("Не найдено основное меню страницы");
        return null;
    }
    return menuBox;
}

export const selectPublication = () => {
    return selectMenuBox().item(0).children.item(1).children.
           item(0).children.item(1).children.item(3).children.item(0).click();
};

export const selectReview = () => {
    return selectMenuBox().item(0).children.item(1).children.
           item(0).children.item(1).children.item(6).children.item(0).click();
}

export const getOrganizationName = () => {
    const orgName = document.querySelector('.sc-sidebar-ya-business-company-plate__company-name');
    if(orgName === null) { return null; }
    return orgName.textContent;
}

export const getPreloadedData = () => {
    const dom = new DOMParser().parseFromString(document.body.outerHTML, "text/html");
    for(const script of dom.getElementsByTagName('script')) {
        if(script.textContent.includes('__PRELOAD_DATA')) {
            try { const preloadDataMatch = script.textContent.
                        match(/window\.__PRELOAD_DATA\s*=\s*(\{.*\});/);
                if(preloadDataMatch && preloadDataMatch[1])
                { return JSON.parse(preloadDataMatch[1]); }
            } catch (e) { console.error("Error parsing __PRELOAD_DATA:", e); }
        }
    }
}