export function addRippleEffect(element: HTMLElement, color?: string) {

    element.style.overflow = "hidden";
    const listener = (e: MouseEvent) => {
        element.style.overflow = "hidden";
        const ripple = document.createElement("span");
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        // Set the size and position of the ripple
        ripple.style.width = ripple.style.height = `${size}px`;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.zIndex = `1`;
        if (color)
            ripple.style.background = color
        ripple.classList.add("ripple");
        element.appendChild(ripple);
        ripple.addEventListener("animationend", () => {
            ripple.remove();
        });
    };

    element.addEventListener('mousedown', listener);
    return () => {
        element.removeEventListener('mousedown', listener);
    };
}