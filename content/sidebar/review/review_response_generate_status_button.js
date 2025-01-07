function addReviewResponseGenerateStatusButtonListener(document) {
    document.getElementById('reviewResponseRefreshButton').addEventListener('click', async function () {
        try {
            let operationId = document.getElementById('reviewResponsId').value;
            const result = await api_service.getResult(operationId);
            // console.log('Review response:', result);
            document.getElementById('reviewResponsStatus').textContent = 'Operation status: ' + result.status;
            document.getElementById('generatedAnswer').value = result.response;
        } catch (error) {
            console.error('Error calling reviewResponseGenerate:', error);
            document.getElementById('reviewResponsStatus').textContent = 'Operation status: Failed';
        }
    });
}