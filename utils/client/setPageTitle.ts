export function setPageTitle(name: string) {
    console.log('siema!')
    let getTitleName = () => {
        let path = location.pathname.replace('/', '');
        if (path)
            return `${name} | ${path}`;

        return name;
    }
    document.title = getTitleName();
}