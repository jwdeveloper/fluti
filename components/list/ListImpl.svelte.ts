export class ListGroupImpl {
    name: string
    isOpen: boolean = $state(false)
    parent: ListImplSvelte

    constructor(name: string, parent: ListImplSvelte) {
        this.name = name;
        this.parent = parent;
    }

    open()
    {
        this.parent.closeAll();
        this.isOpen = true;
    }
}


export class ListImplSvelte {
    groups: ListGroupImpl[] = []

    createGroup(name: string) {
        let group = new ListGroupImpl(name, this);
        this.groups.push(group)
        return group;
    }


    closeAll() {
        for (let group of this.groups) {
            group.isOpen = false;
        }
    }
}


export let useList = () => {
    return new ListImplSvelte();
}