const selectMenuBox = () => {
    const menuBox = document.
          getElementsByClassName('sc-sidebar-ya-business-sidebar__box')
    if(!menuBox || menuBox.length !== 1) {
        console.error("Не найдено основное меню страницы");
        return null;
    }
    return menuBox;
}

export const selectPublication = async () => {
    return selectMenuBox().item(0).children.item(1).children.
           item(0).children.item(1).children.item(3).children.item(0).click();
};

export const selectReview = async () => {
    return selectMenuBox().item(0).children.item(1).children.
           item(0).children.item(1).children.item(6).children.item(0).click();
}

export const getOrganizationName = () => {
    const orgName = document.querySelector('.sc-sidebar-ya-business-company-plate__company-name');
    if(orgName === null) { return null; }
    return orgName.textContent;
}