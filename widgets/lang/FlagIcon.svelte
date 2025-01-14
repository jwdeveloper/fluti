<script>
    let {countryCode,onClick} = $props();
</script>

<img
        onclick={onClick}
        src="https://flagcdn.com/32x24/{countryCode}.png"
        srcset="https://flagcdn.com/32x24/{countryCode}.png 2x,
    https://flagcdn.com/48x36/{countryCode}.png 3x"
        width="24"
        height="16  "
        style="z-index: 444"
        alt="Ukraine">