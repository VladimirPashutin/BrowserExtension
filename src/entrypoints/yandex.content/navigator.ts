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
    selectMenuBox()?.item(0)?.getElementsByClassName('sc-sidebar-ya-business-sidebar-item__option sc-sidebar-ya-business-sidebar-item__option_tab_posts')?.
                     item(0)?.getElementsByTagName('a')?.item(0)?.click();
};

export const selectReview = () => {
    selectMenuBox()?.item(0)?.getElementsByClassName('sc-sidebar-ya-business-sidebar-item__option sc-sidebar-ya-business-sidebar-item__option_tab_reviews')?.
                     item(0)?.getElementsByTagName('a')?.item(0)?.click();
}

export const getOrganizationName = () => {
    const orgName = document.querySelector('.sc-sidebar-ya-business-company-plate__company-name');
    if(orgName === null) { return null; }
    return orgName.textContent;
}

export const getPreloadedData = () => {
    const dom = new DOMParser().parseFromString(document.body.outerHTML, "text/html");
    for(const script of dom.getElementsByTagName('script')) {
        if(script?.textContent?.includes('__PRELOAD_DATA')) {
            try { const preloadDataMatch = script.textContent.
                        match(/window\.__PRELOAD_DATA\s*=\s*(\{.*});/);
                if(preloadDataMatch && preloadDataMatch[1])
                { return JSON.parse(preloadDataMatch[1]); }
            } catch (e) { console.error("Error parsing __PRELOAD_DATA:", e); }
        }
    }
}

export const getReviewElement = (data: string) => {
    for(const reviewElement of document.getElementsByClassName('Review')) {
        const reviewTextElement = reviewElement.getElementsByClassName('Review-Text')[0];
        const reviewText = reviewTextElement?.textContent?.toLowerCase().replaceAll(
                         ' ', '').replaceAll('\n', '');
        const dataText = data.toLowerCase().replaceAll(' ', '').
                                     replaceAll('\n', '');
        if(reviewText !== undefined && dataText.substring(0, 170) === reviewText.substring(0, 170))
        { return reviewElement; }
    }
}