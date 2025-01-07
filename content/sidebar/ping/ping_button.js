function addPingButtonListener(document) {
    document.getElementById('pingButton').addEventListener('click', async function () {
        try {
            document.getElementById('pingStatus').textContent = 'Operation status: Pending';
            const result = await api_service.ping();
            console.log('Ping result:', result);
            document.getElementById('pingStatus').textContent = 'Operation status: ' + result.status;
            document.getElementById('pingId').textContent = 'Operation id: ' + result.id;
        } catch (error) {
            console.error('Error calling ping:', error);
            document.getElementById('pingStatus').textContent = 'Operation status: Failed';
        }
    });
}



// <button id="pingButton">Ping</button> 
// <div id="pingId">Operation id: -</div>
// <div id="pingStatus">Operation status: Not started</div>
// <button id="pingRefreshButton">Проверить статус</button>
// <br>


