<script lang="ts">
    import Button from "$lib/fluti/components/button/Button.svelte";
    import FloatingPanel from "../floatingPanel/FloatingPanel.svelte";
    import Input2 from "$lib/fluti/components/input/Input2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import type {InputProps2} from "$lib/fluti/components/input/Input.type";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";

    let {value = $bindable(''), ...props}: InputProps2 = $props();
    let isOpen = $state(false);
    const days = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"];
    const monthNames = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    let parentElement: HTMLDivElement = $state({})
    const currentDate = new Date();
    let displayedMonth = $state(currentDate.getMonth());
    let displayedYear = $state(currentDate.getFullYear());
    let selectedDay = $state('')
    let displayState = $state('day')


    const handleClick = () => {
        isOpen = !isOpen;
    };

    const handleSelectDay = (day: string) => {
        selectedDay = day;
        value = selectedDay + "/" + (displayedMonth) + "/" + displayedYear;
        isOpen = false;
    }


    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const handlePrevMonth = () => {
        if (displayedMonth === 0) {
            displayedMonth = 11;
            displayedYear -= 1;
        } else {
            displayedMonth -= 1;
        }
    };

    const handleNextMonth = () => {
        if (displayedMonth === 11) {
            displayedMonth = 0;
            displayedYear += 1;
        } else {
            displayedMonth += 1;
        }
    };

    const getMonthDays = () => {
        const daysInMonth = getDaysInMonth(displayedMonth, displayedYear);
        const firstDayIndex = new Date(displayedYear, displayedMonth, 1).getDay();
        const lastMonthDays = displayedMonth === 0
            ? getDaysInMonth(11, displayedYear - 1)
            : getDaysInMonth(displayedMonth - 1, displayedYear);

        const prevMonthDays = Array.from(
            {length: firstDayIndex === 0 ? 6 : firstDayIndex - 1},
            (_, i) => lastMonthDays - (firstDayIndex === 0 ? 5 : firstDayIndex - 2) + i
        );

        const currentMonthDays = Array.from(
            {length: daysInMonth},
            (_, i) => i + 1
        );

        const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);

        const nextMonthDays = Array.from(
            {length: remainingDays},
            (_, i) => i + 1
        );

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    };

    const getMonthName = (month) => {
        return monthNames[month];
    };

    const handleMonthSelect = (month) => {
        displayedMonth = monthNames.indexOf(month);
        displayState = 'day'
    }


    const handleYearSelect = (month) => {
        displayedYear = month;
        displayState = 'day'
    }
    const getYears = () => {
        let years = []
        for (let i = new Date().getFullYear(); i >= 1900; i--) {
            years.push(i);
        }
        return years;
    }

    let years = getYears()

</script>

{#snippet ShowYears()}
    <Panel width="100%" panelType="grid" maxHeight="200px" style="overflow-y: scroll" columns="repeat(5,1fr)"
           gap="0.5em">
        {#each years as day}
            <Panel style="font-weight: bold; text-align: left"
                   ripplerEffect={true}
                   onClick={()=>handleYearSelect(day)}
                   width="100%">
                {day}
            </Panel>
        {/each}
    </Panel>
{/snippet}

{#snippet ShowMonths()}
    <Panel width="100%" panelType="grid" columns="repeat(3,1fr)" gap="0.5em">
        {#each monthNames as day}
            <Panel style=" text-align: left"
                   variant="border"
                   ripplerEffect={true}
                   onClick={()=>handleMonthSelect(day)}
                   width="100%">
                {day}
            </Panel>
        {/each}
    </Panel>
{/snippet}

{#snippet ShowDays()}
    <Panel width="100%" panelType="grid" rows="auto" columns="repeat(7,1fr)" gap="0.1em">
        {#each days as day}
            <Panel style="; text-align: center;">
                {day}
            </Panel>
        {/each}

        {#each getMonthDays() as day, index}
            <Panel onClick={()=>handleSelectDay(day)}
                   ripplerEffect={true}
                   className="day {day === currentDate.getDay()?'day-now.':''}">
                <span class:inactive={index < 7 && day > 7 || index >= 28 && day < 15}>{day}</span>
            </Panel>
        {/each}
    </Panel>
{/snippet}


<FloatingPanel bind:isOpen={isOpen}>
    {#snippet headerSlot()}
        <Input2 onClick={handleClick}
                readonly={true}
                icon="fa-solid fa-calendar-days"
                bind:value={value}
                placeholder="Wybierz date"
                {...props}
        ></Input2>
    {/snippet}

    {#snippet contentSlot()}
        <Panel align="center" direction="column"
               radius="0.5em"
               gap="0"
               padding={flutiTheme.padding.medium}
               variant="border"
               background={flutiTheme.background.primary}>

            <Panel width="100%" gap="0" panelType="grid" columns="auto 1fr auto">
                <Panel justify="flex-start">
                    <Button icon="fa fa-arrow-left" size="btn-small" onClick={handlePrevMonth}/>
                </Panel>
                <Panel direction="row">
                    <div onclick={()=> displayState= "month"} class="date-picker-element">
                        {getMonthName(displayedMonth)}
                    </div>

                    <div onclick={()=> displayState= "year"} class="date-picker-element">
                        {displayedYear}
                    </div>
                </Panel>
                <Panel>
                    <Button icon="fa fa-arrow-right" size="btn-small" onClick={handleNextMonth}/>
                </Panel>
            </Panel>

            {#if displayState === 'day'}
                {@render ShowDays()}
            {/if}

            {#if displayState === 'month'}
                {@render ShowMonths()}
            {/if}

            {#if displayState === 'year'}
                {@render ShowYears()}
            {/if}
        </Panel>
    {/snippet}
</FloatingPanel>


<style>
    .date-picker-element {
        font-weight: bold;
        font-size: var(--font-size-medium);
        border-radius: var(--radius);
    }

    .date-picker-element:hover {
        cursor: pointer;
        background: var(--shadow);
    }

    :global(.day-now) {
        background: var(--accent-primary);
        color: var(--bg-secondary);

    }

    :global(.day) {
        font-weight: 500;
        text-align: center !important;
        height: 32px;
        width: 32px;
    }

    :global(.day:hover) {
        background: var(--accent-primary);
        color: var(--bg-secondary);

    }

    .inactive {
        color: var(--text-disabled);
    }
</style>
