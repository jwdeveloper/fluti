export let addArrowController = (node: HTMLDivElement, target: any) => {

    const inputs = Array.from(node.querySelectorAll('input, button'))
        .filter(input => !input.disabled && !input.hasAttribute('readonly'));

    if (inputs.length > 0) {
        if (target === undefined) {
            // Focus on the first <input> element
            const firstInput = inputs.find(input => input.tagName.toLowerCase() === 'input');

            if (firstInput) firstInput.focus();
        } else {
            let elements = inputs.filter(input => input.tagName.toLowerCase() === "input");

            if (elements.length > 0) {
                elements[0].focus();
            }
        }
    }

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'Enter') {
                // Prevent default scrolling behavior
                event.preventDefault();
                if (index + 1 < inputs.length) {
                    inputs[index + 1].focus();
                }


            } else if (event.key === 'ArrowUp') {
                // Prevent default scrolling behavior
                event.preventDefault();
                // Focus the previous input
                if (index - 1 >= 0) {
                    inputs[index - 1].focus();
                }
            }
        });
    });

    return () => {}
}