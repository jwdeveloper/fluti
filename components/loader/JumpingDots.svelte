<div class="container">
  <span class="jumping-dots">
    <span class="common dot-1"></span>
    <span class="common dot-2"></span>
    <span class="common dot-3"></span>
  </span>
</div>

<style>
    .container {
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--bg-accent);
        border-radius: var(--radius);
    }

    .jumping-dots span {
        position: relative;
        margin-left: auto;
        margin-right: auto;
        animation: jump 1.5s infinite cubic-bezier(0.5, 0.05, 0.1, 1);
        display: inline-block;


        @media (max-height: 768px) {
            top: -3px;
        }

    }

    .common {
        background-color: var(--bg-100);
        width: var(--font-size-small);
        height: var(--font-size-small);

        @media (max-height: 768px) {
            width: 0.4em;
            height: 0.4em;
        }
        border-radius: 50%;
    }

    .jumping-dots .dot-1 {
        margin-right: 3px;
        animation-delay: 0ms;
    }

    .jumping-dots .dot-2 {
        margin-right: 3px;
        animation-delay: 70ms;
    }

    .jumping-dots .dot-3 {
        margin-right: 3px;
        animation-delay: 140ms;
    }

    @keyframes jump {
        0% {
            transform: translateY(0);
        }
        20% {
            transform: translateY(-5px);
        }
        40% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(0);
        }
    }
</style>
