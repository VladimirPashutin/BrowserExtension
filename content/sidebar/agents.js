async function doAgentStatusHandler(
    document,
    agentStatusStorageKey,
    agentRunButtonId,
    agentRunningTitle,
    agentStoppedTitle,
    agentSleepDuration,
    agentTask,
) {

    chrome.storage.local.get([agentStatusStorageKey], async function (result) {

        let agentStatus = result[agentStatusStorageKey];
        let button = document.getElementById(agentRunButtonId);

        console.log('button:', button);

        if (agentStatus === 'running') {
            try {
                // update button

                button.innerHTML = agentRunningTitle;

                await new Promise((resolve) => setTimeout(resolve, agentSleepDuration));

                let actualAgentStatus = await new Promise((resolve, reject) => {
                    chrome.storage.local.get([agentStatusStorageKey], function (result) {
                        resolve(result[agentStatusStorageKey]);
                    });
                }, 1000);
                if (actualAgentStatus === 'running') {
                    await agentTask(document);
                    await new Promise((resolve) => setTimeout(resolve, agentSleepDuration));
                }

                actualAgentStatus = await new Promise((resolve, reject) => {
                    chrome.storage.local.get([agentStatusStorageKey], function (result) {
                        resolve(result[agentStatusStorageKey]);
                    });
                }, 1000);
                if (actualAgentStatus === 'running') {
                    location.reload();
                }
            } catch (error) {

                await chrome.storage.local.set({ [agentStatusStorageKey]: 'stopped' });
                button.innerHTML = agentStoppedTitle;
            }
        }

    }
    );
}


function addAgentRunButtonListener(
    document,
    agentStatusStorageKey,
    agentRunButtonId,
    agentRunningTitle,
    agentStoppedTitle,
) {
    const button = document.getElementById(agentRunButtonId);
    const originalButtonText = button.innerHTML;

    button.addEventListener('click', async function () {

        console.log('Agent run button clicked agentRunButtonId:', agentRunButtonId);

        // Получить актуальный статус агента из хранилища
        let agentStatus = await new Promise((resolve, reject) => {
            chrome.storage.local.get([agentStatusStorageKey], function (result) {

                resolve(result[agentStatusStorageKey]);

            });
        });

        // Если агент уже работает, то остановить его
        if (agentStatus === 'running') {
            await chrome.storage.local.set({ [agentStatusStorageKey]: 'stopped' });

            console.log('Agent stopped');

            button.innerHTML = agentStoppedTitle;
            return;
        }

        // Если статус агента неизвестен или он остановлен, то запустить его
        if (agentStatus === 'stopped' || !agentStatus) {
            agentStatus = 'running';
            await chrome.storage.local.set({ [agentStatusStorageKey]: agentStatus });

            console.log('Agent running');

            button.innerHTML = agentRunningTitle;
        } else {
            console.error('Unknown agent status:', agentStatus);
            return;
        }

        // обновить страницу, задача агента начнется после обновления
        location.reload()

    });
}