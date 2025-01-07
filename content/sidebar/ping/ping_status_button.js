

function addPingStatusButtonListener(document) {
    document.getElementById('pingRefreshButton').addEventListener('click', async function () {
        try {
            let operationId = document.getElementById('pingId').textContent.replace('Operation id: ', '');
            const result = await api_service.getResult(operationId);
            console.log('Ping result:', result);
            document.getElementById('pingStatus').textContent = 'Operation status: ' + result.status;
        } catch (error) {
            console.error('Error calling ping:', error);
            document.getElementById('pingStatus').textContent = 'Operation status: Failed';
        }
    });
}