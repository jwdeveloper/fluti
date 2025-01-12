import type {ListWindowProps} from "./ListWindowTypes";
import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
import ListWindow from "./ListWindow.svelte";

export let useListWindow = (props?: ListWindowProps) => {
    let window = useWindow(ListWindow)
    window.input = props;
    return window;
}